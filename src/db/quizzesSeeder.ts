import mongoose from 'mongoose'
import log from '../utilities/logger'
import { faker } from '@faker-js/faker/locale/ru'
import {
  TQuestionSchema,
  TQuizRequestSchema,
} from '../modules/quizzes/schemas/quiz.schema'
import QuizModel from '../modules/quizzes/models/quiz.model'
import connectToDb from '../utilities/connectToDb'

type TUserId = {
  userId: string
}
type TQuizSeeder = TQuizRequestSchema & TUserId

const quizzesSeeder = async (): Promise<void> => {
  connectToDb()

  const seedQuizCount = 1000
  const seedQuestionCount = 5

  const randomQuizzes: TQuizRequestSchema[] = []
  const randomQuestions: TQuestionSchema[] = []

  for (let i = 0; i < seedQuestionCount; i++) {
    const questions: TQuestionSchema = {
      text: faker.lorem.paragraph(1),
      rightAnswerId: faker.number.int({ min: 1, max: 3 }) as unknown as string,
      answers: [
        faker.lorem.words({ min: 1, max: 3 }),
        faker.lorem.words({ min: 1, max: 3 }),
        faker.lorem.words({ min: 1, max: 3 }),
      ],
    }
    randomQuestions.push(questions)
  }

  for (let i = 0; i < seedQuizCount; i++) {
    const quiz: TQuizSeeder = {
      userId: faker.database.mongodbObjectId(),
      title: faker.lorem.sentence({ min: 3, max: 7 }),
      description: faker.lorem.sentences({ min: 2, max: 5 }),
      questions: randomQuestions,
    }
    randomQuizzes.push(quiz)
  }

  log.info(randomQuizzes)

  const seedDB = async (): Promise<void> => {
    await QuizModel.insertMany(randomQuizzes)
  }

  await seedDB()
  mongoose.connection.close()
}

quizzesSeeder()
