import { Quiz } from '../models/quiz.model'

export default class QuizListItemResponseDTO {
  id: string
  title: string
  description: string
  userId: string
  quizId: string

  static fromModel(quizModel: Quiz): QuizListItemResponseDTO {
    const dto = new this()
    dto.id = quizModel._id
    dto.title = quizModel.title
    dto.description = quizModel.description
    dto.userId = quizModel.userId
    return dto
  }
}
