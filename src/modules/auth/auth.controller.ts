import { NextFunction, Request, Response } from 'express'
import {
  TUserRequestSchema,
  userRequestSchema,
} from '../../users/schema/user.schema'
import UserModel from '../../users/models/user.model'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import TokenModel from './models/token.model'

class AuthController {
  // ========================
  // ===== Registration =====
  // ========================
  async register(
    req: Request<{}, {}, TUserRequestSchema>,
    res: Response,
  ): Promise<Response> {
    const candidateUser = req.body

    try {
      // валидация с ZOD
      const verifiedUser = userRequestSchema.parse(candidateUser)

      // хеширование пароля
      const hashPassword = await bcrypt.hash(
        verifiedUser.password,
        Number(process.env.SALT),
      )

      // создаём объект пользователя прошедшего валидацию, меняем пароль на хэшированный, записываем нового пользователя в db
      const updatedUserData = {
        ...verifiedUser,
        password: hashPassword,
      }
      const createdUser = await UserModel.create(updatedUserData)

      // создаём токен, добавляем в db
      const token = sign({}, String(process.env.JWT_SECRET_KEY), {
        expiresIn: '1h',
        algorithm: 'HS256',
      })
      TokenModel.create({
        userId: createdUser._id,
        token,
      })

      // создаём cookie на основе токена
      res.cookie('auth.token', token, {
        httpOnly: true,
        maxAge: 3600 * 1000,
        sameSite: 'lax',
      })
      // создаем объект ответа пользователю
      const resToUser = {
        user: {
          email: createdUser.email,
          nickname: createdUser.nickname,
          id: createdUser._id,
        },
      }

      return res.status(201).json(resToUser)
    } catch (e: any) {
      // ошибка DB mongo, попытка зарегистрировать пользователя уже существующего в BD
      if (e?.name === 'MongoServerError' && e.code === 11000) {
        return res
          .status(422)
          .send(
            `Пользователь с таким email: ${candidateUser.email}, уже зарегистрирован!`,
          )
      }
      // все ошибки описанные в схеме ZOD
      if (e?.name === 'ZodError') {
        return res.status(422).send(e.message)
      }
      // непредвиденные ошибки
      return res.status(500).send(e.message)
    }
  }

  // ========================
  // ======== Login =========
  // ========================

  login(req: Request, res: Response): void {
    res.json({ message: 'Логирование пользователя' })
  }

  // ========================
  // ======= Logout =========
  // ========================

  logout(req: Request, res: Response): void {
    res.json({ message: 'Выход из системы' })
  }

  // ========================
  // ====== GetUser =========
  // ========================

  getUser(req: Request, res: Response): void {
    const token = req.body.token

    console.log(token)

    res.json({ message: 'Получение пользователя' })
  }
}

export default new AuthController()
