import {
  type DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose'
import { TUserSchema } from '../schemas/user.schema'

@modelOptions({ schemaOptions: { timestamps: true } })
export class User implements TUserSchema {
  private static _currentUser?: DocumentType<User>

  @prop({ required: true })
  nickname: string

  @prop({ required: true, unique: true, lowercase: true })
  email: string

  @prop({ required: true })
  password: string

  /**
   * Установить авторизованного пользователя
   */
  static setCurrentUser(user: DocumentType<User>): void {
    User._currentUser = user
  }

  /**
   * Получить авторизованного пользователя
   * @throws {Error} Если пользователь не авторизован
   */
  static currentUser(): DocumentType<User> {
    if (!User._currentUser) {
      throw new Error('Пользователь не авторизован')
    }
    return User._currentUser
  }
}

const UserModel = getModelForClass(User)

export default UserModel
