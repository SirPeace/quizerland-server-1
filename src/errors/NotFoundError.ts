export default class NotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'Нужная запись не найдена')
    this.name = 'NotFoundError'
  }
}
