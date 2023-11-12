import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { TUserRequestSchema } from '../schemas/user.schema'

@modelOptions({ schemaOptions: { timestamps: true } })
export class User implements TUserRequestSchema {
  @prop({ required: true })
  nickname: string

  @prop({ required: true, unique: true, lowercase: true })
  email: string

  @prop({ required: true })
  password: string
}

const UserModel = getModelForClass(User)

export default UserModel
