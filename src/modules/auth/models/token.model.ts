import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { Schema } from 'mongoose'

@modelOptions({ schemaOptions: { timestamps: true } })
class Token {
  @prop({ type: Schema.Types.ObjectId, ref: 'UserModel', required: true })
  userId: string

  @prop({ type: String, required: true })
  token: string
}

const TokenModel = getModelForClass(Token)

export default TokenModel
