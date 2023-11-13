import 'dotenv/config'
import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'

import connectToDb from './utilities/connectToDb'
import log from './utilities/logger'
import router from './routes/router'

const app = express()
const PORT = process.env.APP_PORT ?? 8000

app.use(express.json())
app.use(cookieParser())
app.use(router)

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
