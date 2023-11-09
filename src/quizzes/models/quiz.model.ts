import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose'
import { TQuizRequestSchema } from '../schema/quiz.schema'
import { Question } from './question.model'

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Quiz implements TQuizRequestSchema {
  @prop({ required: true })
  title: string

  @prop({ required: true })
  description: string

  @prop({ required: true })
  questions: Question[]
}

const QuizModel = getModelForClass(Quiz)

export default QuizModel
