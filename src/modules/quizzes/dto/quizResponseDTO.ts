import { Schema } from 'mongoose'
import { Quiz } from '../models/quiz.model'
import { Progress } from '../models/progress.model'
import { Question } from '../models/question.model'

export default class QuizResponseDTO {
  quizItem: {
    id?: Schema.Types.ObjectId
    title: string
    description: string
    userId: string
    questions: Question[]
  }
  progress: {
    id?: Schema.Types.ObjectId
    quizId: string
    userId: string
    currentQuestionIndex: number
    rightAttempts: number
    isFinished: boolean
  }

  static fromModel(quizModel: Quiz, progressModel: Progress): QuizResponseDTO {
    const dto = new this()
    dto.quizItem = {
      id: quizModel._id,
      title: quizModel.title,
      description: quizModel.description,
      userId: quizModel.userId,
      questions: quizModel.questions,
    }
    dto.progress = {
      id: progressModel._id,
      quizId: progressModel.quizId,
      userId: progressModel.userId,
      currentQuestionIndex: progressModel.currentQuestionIndex,
      rightAttempts: progressModel.rightAttempts,
      isFinished: progressModel.isFinished,
    }

    return dto
  }
}
