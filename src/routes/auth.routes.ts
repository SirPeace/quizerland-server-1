import express from 'express'
import AuthController from '../modules/auth/auth.controller'

const authRoutes = express.Router()

authRoutes.post('/register', AuthController.register)
authRoutes.post('/login', AuthController.login)
authRoutes.delete('/delete', AuthController.logout)
authRoutes.get('/get_user', AuthController.getUser)

export default authRoutes
