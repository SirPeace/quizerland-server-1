import 'dotenv/config'
import mongoose from 'mongoose'
import log from './logger'

async function connectToDb(): Promise<void> {
  const DB_URL = process.env.DB_URL as string

  try {
    await mongoose.connect(DB_URL)
    log.info('Подключение к базе данных')
  } catch (error) {
    console.log(error)
  }
}

export default connectToDb
