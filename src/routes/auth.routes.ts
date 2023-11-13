import express from 'express'
import AuthController from '../modules/auth/auth.controller'

const authRoutes = express.Router()

authRoutes.post('/register', AuthController.register)
authRoutes.post('/', AuthController.login)
authRoutes.delete('/', AuthController.logout)
authRoutes.get('/', AuthController.getUser)

export default authRoutes
