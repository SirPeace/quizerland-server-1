import 'dotenv/config'
import express, { Request, Response } from 'express'

const app = express()

const PORT = process.env.PORT ?? 8000

app.get('/', (req: Request, res: Response) => {
  res.send('Это изменило мир!')
})

const start = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
