import { z, object, string } from 'zod'

export const quizRequestSchema = object({
  title: string()
    .min(1, 'Поле обязательное для заполнения!')
    .max(100, 'Название не может иметь более 100 символов!'),
  description: string()
    .min(1, 'Поле обязательное для заполнения!')
    .max(500, 'Описание не может иметь более 500 символов!'),
  questions: object({
    text: string()
      .min(1, 'Поле обязательное для заполнения!')
      .max(100, 'Вопрос не может содержать более 100 символов!'),
    // TODO: Перевести на тип number().int()
    rightAnswerId: string({
      errorMap: () => ({ message: 'Выберите вариант ответа' }),
    })
      .regex(/^\d+$/, { message: 'Выберите вариант ответа' })
      .optional(),
    answers: string()
      .min(1, 'Поле обязательное для заполнения!')
      .max(70, 'Ответ не может сдержать более 70 символов!')
      .array(),
  }).array(),
})
export type TQuizRequestSchema = z.infer<typeof quizRequestSchema>
export type TQuestionSchema = TQuizRequestSchema['questions'][0]
