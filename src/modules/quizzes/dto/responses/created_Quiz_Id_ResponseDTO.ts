import { Date, Schema } from 'mongoose'
import { Quiz } from '../../models/quiz.model'
import { User } from '../../../../users/models/user.model'

export default class CreatedQuizIdResponseDTO {
    quizId?: Schema.Types.ObjectId

    static fromModel(quizModel: Quiz): CreatedQuizIdResponseDTO {
        const dto = new this()
        dto.quizId = quizModel._id

        return dto
    }
}
