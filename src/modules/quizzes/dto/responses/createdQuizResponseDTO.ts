import { Schema } from 'mongoose'
import { Quiz } from '../../models/quiz.model'
import { User } from '../../../../users/models/user.model'

export default class CreatedQuizResponseDTO {
    quizId?: Schema.Types.ObjectId
    userId?: Schema.Types.ObjectId
    createdAt: string
    updatedAt: string

    static fromModel(quizModel: Quiz, userModel: User): CreatedQuizResponseDTO {
        const dto = new this()
        dto.quizId = quizModel._id
        dto.userId = userModel._id

        return dto
    }
}
