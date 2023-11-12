import { z, object, string } from 'zod'

export const loginRequestSchema = object({
  email: string()
    .min(1, 'Поле обязательное для заполнения!')
    .email('Электронная почта имеет невалидное значение!'),
  password: string()
    .min(8, 'Пароль должен содержать не менее 8 символов!')
    .max(32, 'Пароль не может иметь более 32 символов!'),
})
export type TLoginRequestSchema = z.infer<typeof loginRequestSchema>
