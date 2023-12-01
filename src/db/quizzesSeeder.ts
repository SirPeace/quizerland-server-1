import mongoose from 'mongoose'
import { faker } from '@faker-js/faker/locale/ru'
import QuizModel, { Quiz } from '../modules/quizzes/models/quiz.model'
import { Question } from '../modules/quizzes/models/question.model'
import connectToDb from '../utilities/connectToDb'
import log from '../utilities/logger'

const quizzesSeeder = async (): Promise<void> => {
  connectToDb()

  const seedQuizCount = 1000
  const seedQuestionCount = 5

  const randomQuizzes: Quiz[] = []
  const randomQuestions: Question[] = []

  for (let i = 0; i < seedQuestionCount; i++) {
    const questions: Question = {
      text: faker.lorem.paragraph(1),
      rightAnswerId: String(faker.number.int({ min: 1, max: 3 })),
      answers: [
        faker.lorem.words({ min: 1, max: 3 }),
        faker.lorem.words({ min: 1, max: 3 }),
        faker.lorem.words({ min: 1, max: 3 }),
      ],
    }
    randomQuestions.push(questions)
  }

  for (let i = 0; i < seedQuizCount; i++) {
    const quiz: Quiz = {
      userId: faker.database.mongodbObjectId(),
      title: faker.lorem.sentence({ min: 3, max: 7 }),
      description: faker.lorem.sentences({ min: 2, max: 5 }),
      questions: randomQuestions,
    }
    randomQuizzes.push(quiz)
  }

  const seedDB = async (): Promise<void> => {
    await QuizModel.insertMany(randomQuizzes)
  }

  await seedDB()
  log.info('( SEEDER ): Данные успешно загружены')
  mongoose.connection.close()
}

quizzesSeeder()
