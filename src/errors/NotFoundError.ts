export default class NotFoundError extends Error {
    constructor(message: string = 'Нужная запись не найдена') {
        super(message)
        this.name = 'NotFoundError'
        this.message = message
    }
}
