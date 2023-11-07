import 'dotenv/config'
import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import connectToDb from './utilities/connectToDb'
import log from './utilities/logger'

const app = express()

app.use(bodyParser.json())

const PORT = process.env.PORT ?? 8000

app.get('/', (req: Request, res: Response) => {
  res.send('Это изменило мир!')
})

const start = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      log.info(`Сервер запущен на http://localhost:${PORT}`)
    })

    connectToDb()
  } catch (error) {
    log.error(error)
  }
}

start()
