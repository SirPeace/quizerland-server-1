import { z, object, string, number } from 'zod'

export const quizSchema = object({
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
        rightAnswerIndex: number({
            errorMap: () => ({ message: 'Выберите вариант ответа' }),
        })
            .int('Выберите вариант ответа')
            .optional(),
        answers: string()
            .min(1, 'Поле обязательное для заполнения!')
            .max(70, 'Ответ не может сдержать более 70 символов!')
            .array(),
    }).array(),
})
export type TQuizSchema = z.infer<typeof quizSchema>
export type TQuestionSchema = TQuizSchema['questions'][0]
