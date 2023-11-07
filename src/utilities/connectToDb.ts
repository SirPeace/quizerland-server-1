import 'dotenv/config'
import mongoose from 'mongoose'
import log from './logger'

const connectToDb = async (): Promise<void> => {
  const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } =
    process.env as Record<string, string>

  const dbUri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`

  try {
    await mongoose.connect(dbUri)
    log.info('База данных подключена')
  } catch (error) {
    log.error(error)
  }
}
export default connectToDb
