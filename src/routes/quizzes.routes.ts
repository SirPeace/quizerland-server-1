import express from 'express'
import QuizzesController from '../modules/quizzes/quizzes.controller'
import auth from '../middleware/auth'

const quizzesRoutes = express.Router()

quizzesRoutes.use(auth).post('/', QuizzesController.create)
quizzesRoutes.use(auth).get('/', QuizzesController.quizzes)
quizzesRoutes.use(auth).get('/:id', QuizzesController.getQuizById)
quizzesRoutes
  .use(auth)
  .get('available-quiz', QuizzesController.getTheNextAvailableQuiz)
quizzesRoutes
  .use(auth)
  .put('/:quizId/progress', QuizzesController.updateQuizProgress)
quizzesRoutes
  .use(auth)
  .delete('/:quizId/progress', QuizzesController.deleteQuizProgress)

export default quizzesRoutes
