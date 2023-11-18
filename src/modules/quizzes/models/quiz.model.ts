import {
  modelOptions,
  prop,
  getModelForClass,
  Severity,
} from '@typegoose/typegoose'
import { TQuizRequestSchema } from '../schemas/quiz.schema'
import { Question } from './question.model'
import { Schema } from 'mongoose'

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Quiz implements TQuizRequestSchema {
  @prop({ type: Schema.Types.ObjectId, ref: 'UserModel', required: true })
  userId: string

  @prop({ required: true })
  title: string

  @prop({ required: true })
  description: string

  @prop({ required: true })
  questions: Question[]
}

const QuizModel = getModelForClass(Quiz)

export default QuizModel
