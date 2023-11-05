import express, { Request, Response } from 'express'

const app = express()

app.get('/', (req: Request, res: Response) => {
  return res.json({
    status: 'success',
  })
})

app.listen(8000, () => console.log('Сервер запущен на порту: 8000'))
