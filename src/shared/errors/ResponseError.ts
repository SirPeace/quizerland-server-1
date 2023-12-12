import type { Response } from 'express'

interface ResponseErrorObject {
    message: string
}
export type ErrorResponse = Response<ResponseErrorObject>

export default class ResponseError extends Error {
    public constructor(
        public message: string = 'Ошибка, обратитесь в тех. поддержку',
        public statusCode: number = 500,
    ) {
        super(message)
    }

    public toResponse(baseResponse: Response): ErrorResponse {
        return baseResponse.status(this.statusCode).json(this.toObject())
    }

    protected toObject(): ResponseErrorObject {
        return {
            message: this.message,
        }
    }
}
