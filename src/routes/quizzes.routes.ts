import express from 'express'
import QuizzesController from '../modules/quizzes/quizzes.controller'
import auth from '../middleware/auth'

const quizzesRoutes = express.Router()

quizzesRoutes.use(auth).post('/create', QuizzesController.create)
quizzesRoutes.use(auth).get('/', QuizzesController.quizzes)
quizzesRoutes.use(auth).get('/quiz/:id', QuizzesController.getQuizById)

export default quizzesRoutes
