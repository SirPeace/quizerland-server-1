import {
  Severity,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose'
import { Schema } from 'mongoose'

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Progress {
  @prop({ auto: true })
  _id?: Schema.Types.ObjectId

  @prop({ type: Schema.Types.ObjectId, ref: 'QuizModel', required: true })
  quizId: string

  @prop({ type: Schema.Types.ObjectId, ref: 'UserModel', required: true })
  userId: string

  @prop({ type: Number, required: true })
  currentQuestionIndex: number

  @prop({ required: true })
  rightAttempts: number

  @prop({ required: true })
  isFinished: boolean
}

const ProgressModel = getModelForClass(Progress)

export default ProgressModel
