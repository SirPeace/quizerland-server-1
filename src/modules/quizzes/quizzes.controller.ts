import { Request, Response } from 'express'
import { TQuizSchema, quizSchema } from './schemas/quiz.schema'
import UserModel, { User } from '../../users/models/user.model'
import QuizModel, { Quiz } from './models/quiz.model'
import QuizListItemResponseDTO from './dto/quizListItemResponseDTO'
import NotFoundError from '../../errors/NotFoundError'
import ProgressModel, { Progress } from './models/progress.model'
import QuizResponseDTO from './dto/quizResponseDTO'
import ProgressRequestDTO from './dto/progressRequestDTO'

class QuizzesController {
  // ========================
  // ===== create quiz ======
  // ========================
  async create(
    req: Request<{}, {}, TQuizSchema>,
    res: Response,
  ): Promise<Response> {
    const candidateQuiz = req.body

    const user = User.currentUser()

    try {
      // валидация  ( ZOD )
      const verifiedBodyRequest = quizSchema.parse(candidateQuiz)

      // Добавляем новый тест в db, привязывая id-пользователя к тесту
      const quiz = {
        ...verifiedBodyRequest,
        userId: user._id,
      }

      const createdQuiz = await QuizModel.create(quiz)

      return res.status(201).json(createdQuiz)
    } catch (err: any) {
      // все ошибки описанные в схеме ZOD
      if (err?.name === 'ZodError') {
        return res.status(422).json(err)
      }
      // непредвиденные ошибки
      return res.status(500).json(err)
    }
  }

  // ========================
  // === get all quizzes ====
  // ========================

  async quizzes(req: Request, res: Response): Promise<Response> {
    //! Добавляем пагинацию
    // Если в параметре не задана задана страница, всегда отображаем 1-ю
    const page = req.query.page || 0
    // Устанавливаем количество тестов отображаемых на одной странице
    const quizzesPerPage = 50
    const quizzesTotalCount = await QuizModel.count()

    const quizzes = await QuizModel.find()
      .sort({ createdAt: -1 })
      .skip(+page * quizzesPerPage)
      .limit(quizzesPerPage)

    const quizzesResponse = quizzes.map((quiz: Quiz) =>
      QuizListItemResponseDTO.fromModel(quiz),
    )

    if (quizzesResponse.length === 0) {
      return res
        .status(403)
        .json({ message: 'В базе данных пока нет тестов, создайте первый)' })
    }

    return res.status(200).json({ quizzes: quizzesResponse, quizzesTotalCount })
  }

  // ========================
  // === get quiz by id =====
  // ========================

  async getQuizById(
    req: Request<{ id: string }>,
    res: Response<QuizResponseDTO>,
  ): Promise<Response<QuizResponseDTO>> {
    const quizId = req.params.id
    const user = User.currentUser()

    try {
      const quizItem = await QuizModel.findById(quizId)
      if (quizItem === null) {
        throw new NotFoundError(`Тест с id: ${quizId} не найден`)
      }

      console.log({
        quizId: quizItem._id,
        userId: user._id,
      })

      const detectedProgress = await ProgressModel.findOne({
        quizId: quizItem._id,
        userId: user._id,
      })

      const progress =
        detectedProgress === null
          ? await ProgressModel.create({
              userId: user._id,
              quizId: quizItem._id,
              currentQuestionIndex: 0,
              rightAttempts: 0,
              isFinished: false,
            })
          : detectedProgress

      const quizResponse = QuizResponseDTO.fromModel(quizItem, progress)

      return res.status(200).json(quizResponse)
    } catch (err: any) {
      if (err.name === 'CastError') return res.status(422)
      if (err instanceof NotFoundError) return res.status(404)
    }

    return res.status(500)
  }

  async updateQuizProgress(
    req: Request<{ quizId: string }, {}, ProgressRequestDTO>,
    res: Response<Progress | Error>,
  ): Promise<Response<Progress | Error>> {
    const { isRightAttempt } = req.body
    const user = UserModel.currentUser()

    try {
      const quiz = await QuizModel.findById(req.params.quizId)
      if (quiz === null) {
        throw new NotFoundError('Тест не найден')
      }

      const quizProgress = await ProgressModel.findOne({
        quizId: quiz.id,
        userId: user.id,
      })
      if (quizProgress === null) {
        throw new NotFoundError('Прогресс не найден')
      }

      const nextQuestionIndex = quizProgress.currentQuestionIndex + 1
      const isQuizFinished = nextQuestionIndex === quiz.questions.length

      quizProgress.rightAttempts += isRightAttempt ? 1 : 0
      if (isQuizFinished) {
        quizProgress.isFinished = true
      } else {
        quizProgress.currentQuestionIndex = nextQuestionIndex
      }
      await quizProgress.save()

      return res.status(201).json(quizProgress)
    } catch (err: any) {
      if (err instanceof NotFoundError) {
        return res.status(404).send(err)
      }
      return res.status(500).json(err)
    }
  }
}

export default new QuizzesController()
