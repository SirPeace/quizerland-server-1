import {
    modelOptions,
    prop,
    getModelForClass,
    Severity,
} from '@typegoose/typegoose'
import { TQuizSchema } from '../schemas/quiz.schema'
import { Question } from './question.model'
import { Schema } from 'mongoose'

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
    // Если есть смешанный тип (пример <number | undefined>)
    // options: {
    //     allowMixed: Severity.ALLOW,
    // },
})
export class Quiz implements TQuizSchema {
    @prop({ auto: true })
    _id?: Schema.Types.ObjectId

    @prop({ type: Schema.Types.ObjectId, ref: 'UserModel', required: true })
    userId: string

    @prop({ required: true })
    title: string

    @prop({ required: true })
    description: string

    @prop({ required: true })
    questions: Question[]

    @prop({ type: Schema.Types.Date })
    createdAt: string

    @prop({ type: Schema.Types.Date })
    updatedAt: string
}

const QuizModel = getModelForClass(Quiz)

export default QuizModel
