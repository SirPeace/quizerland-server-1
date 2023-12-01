import { Request, Response } from 'express'
import { TQuizSchema, quizSchema } from './schemas/quiz.schema'
import UserModel, { User } from '../../users/models/user.model'
import TokenModel from '../auth/models/token.model'
import QuizModel, { Quiz } from './models/quiz.model'
import QuizListItemResponseDTO from './dto/quizListItemResponseDTO'
import log from '../../utilities/logger'
import NotFoundError from '../../errors/NotFoundError'

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
    req: Request<{ id: string }, {}, {}>,
    res: Response,
  ): Promise<Response> {
    const quizId = req.params.id

    try {
      const quizItem = await QuizModel.findById(quizId)
      if (quizItem === null) {
        throw new NotFoundError(`Тест с id: ${quizId} не найден`)
      }

      return res.status(200).json(quizItem)
    } catch (err: any) {
      if (err.name === 'CastError')
        return res.status(422).json({ message: err.message })
      if (err instanceof NotFoundError)
        return res.status(404).json({ message: err.message })
    }

    return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
  }
}

export default new QuizzesController()
