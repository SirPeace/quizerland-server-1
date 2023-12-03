import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'
import { TQuestionSchema } from '../schemas/quiz.schema'

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Question implements TQuestionSchema {
  @prop({ required: true })
  text: string

  @prop({ required: true })
  rightAnswerIndex: number

  @prop({ required: true })
  answers: string[]
}

const QuestionModel = getModelForClass(Question)

export default QuestionModel
