import { Request, Response } from 'express'
import { TQuizRequestSchema, quizRequestSchema } from './schemas/quiz.schema'
import UserModel from '../../users/models/user.model'
import TokenModel from '../auth/models/token.model'
import QuizModel from './models/quiz.model'

class QuizzesController {
  async create(
    req: Request<{}, {}, TQuizRequestSchema>,
    res: Response,
  ): Promise<Response> {
    const candidateQuiz = req.body
    console.log(candidateQuiz)

    try {
      // валидация  ( ZOD )
      const verifiedBodyRequest = quizRequestSchema.parse(candidateQuiz)

      // Достаём токен из cookie
      const token = req.cookies['auth.token'] as string | undefined
      if (!token) {
        return res.status(401).json({ message: 'Пользователь не авторизован' })
      }

      // Проверяем, есть ли токен ( из cookie ) в db
      const verifiedToken = await TokenModel.findOne({ token })
      // Если токен есть, находим пользователя с id === userId из токена
      const user = await UserModel.findById(verifiedToken?.userId)
      if (user === null) {
        return res
          .status(403)
          .json({ message: 'Пользователь не зарегистрирован' })
      }

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
}

export default new QuizzesController()
