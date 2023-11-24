import { Quiz } from '../models/quiz.model'

export default class QuizListItemResponseDTO {
  title: string
  description: string
  userId: string

  static fromModel(quizModel: Quiz): QuizListItemResponseDTO {
    const dto = new this()
    dto.title = quizModel.title
    dto.description = quizModel.description
    dto.userId = quizModel.userId
    return dto
  }
}
