import express from 'express'
import authRoutes from './auth.routes'
import quizzesRoutes from './quizzes.routes'

const router = express.Router()

router.use('/api/auth', authRoutes)
router.use('/api/quizzes', quizzesRoutes)

export default router
