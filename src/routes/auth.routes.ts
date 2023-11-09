import express from 'express'
import AuthController from '../auth/auth.controller'

const authRoutes = express.Router()

authRoutes.post('/register', AuthController.register)
authRoutes.post('/login', AuthController.login)

export default authRoutes
