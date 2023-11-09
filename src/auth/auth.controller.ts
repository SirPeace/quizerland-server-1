import { Request, Response } from 'express'

class AuthController {
  register(req: Request, res: Response): Response {
    return res.json({ message: 'Усердие спасёт мир!' })
  }

  login(): void {}
}

export default new AuthController()
