import express from 'express'
import QuizzesController from '../modules/quizzes/quizzes.controller'

const quizzesRoutes = express.Router()

quizzesRoutes.post('/create', QuizzesController.create)

export default quizzesRoutes
