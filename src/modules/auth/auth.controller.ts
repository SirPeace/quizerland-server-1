import { Request, Response } from 'express'
import {
  TUserRequestSchema,
  userRequestSchema,
} from '../../users/schemas/user.schema'
import UserModel from '../../users/models/user.model'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import TokenModel from './models/token.model'
import { TLoginRequestSchema, loginRequestSchema } from './schemas/login.schema'
import log from '../../utilities/logger'

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
      // валидация  ( ZOD )
      const verifiedBodyRequest = userRequestSchema.parse(candidateUser)

      // хеширование пароля
      const hashPassword = await bcrypt.hash(
        verifiedBodyRequest.password,
        Number(process.env.SALT),
      )

      // создаём объект пользователя, прошедшего валидацию тела запроса, меняем пароль на хэшированный, записываем нового пользователя в db
      const updatedUserData = {
        ...verifiedBodyRequest,
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

      // создаем объект ответа пользователю
      const responseToUser = {
        user: {
          email: createdUser.email,
          nickname: createdUser.nickname,
          id: createdUser._id,
        },
      }

      // создаём cookie на основе токена
      res.cookie('auth.token', token, {
        httpOnly: true,
        maxAge: 3600 * 1000,
        sameSite: 'lax',
      })
      return res.status(201).json(responseToUser)
    } catch (err: any) {
      // ошибка DB mongo, попытка зарегистрировать пользователя уже существующего в BD
      if (err?.name === 'MongoServerError' && err.code === 11000) {
        return res
          .status(422)
          .send(
            `Пользователь с таким email: ${candidateUser.email}, уже зарегистрирован!`,
          )
      }
      // все ошибки описанные в схеме ZOD
      if (err?.name === 'ZodError') {
        return res.status(422).send(err)
      }
      // непредвиденные ошибки
      return res.status(500).send(err)
    }
  }

  // ========================
  // ======== Login =========
  // ========================

  async login(
    req: Request<{}, {}, TLoginRequestSchema>,
    res: Response,
  ): Promise<Response> {
    const loginCandidate = req.body

    try {
      // валидация тела запроса ( ZOD )
      const verifiedBodyRequest = loginRequestSchema.parse(loginCandidate)
      const { email, password } = verifiedBodyRequest

      // проверяем наличие пользователя с таким email в db
      const verifiedUser = await UserModel.findOne({
        email,
      })
      if (verifiedUser === null) {
        return res.status(422).send(`Неверный логин и/или пароль`)
      }
      // проверяем пароль
      const isCorrectPassword = await bcrypt.compare(
        password,
        verifiedUser?.password,
      )
      if (!isCorrectPassword) {
        return res.status(422).send(`Неверный логин и/или пароль`)
      }

      //! создаём токен, добавляем в db
      const token = sign({}, String(process.env.JWT_ACCESS_TOKEN), {
        expiresIn: '1h',
        algorithm: 'HS256',
      })
      TokenModel.create({ userId: verifiedUser._id, token })

      //! создаем объект ответа пользователю
      const responseToUser = {
        user: {
          email: verifiedUser.email,
          nickname: verifiedUser.nickname,
          id: verifiedUser._id,
        },
      }

      //! создаём cookie на основе токена
      res.cookie('login.token', token, {
        httpOnly: true,
        maxAge: 3600 * 1000,
        sameSite: 'lax',
      })
      return res.status(201).send(responseToUser)
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return res.status(422).send(err)
      }

      return res.status(500).send(`Ошибка 500`)
    }
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
