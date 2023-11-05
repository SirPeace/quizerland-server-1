import 'dotenv/config'
import express, { Request, Response } from 'express'
import mongoose, { connect } from 'mongoose'
import connectToDb from './utilities/connectToDb'

const app = express()

const PORT = process.env.PORT ?? 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Smth changed World!')
})

const start = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`)

      connectToDb()
    })
  } catch (error) {
    console.log(error)
  }
}

start()
