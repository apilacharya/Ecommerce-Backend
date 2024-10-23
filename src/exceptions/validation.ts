import { HttpException } from "./root";

export class UnprocessableEntity extends HttpException {
    constructor(message: string, errorCode: number, errors? : any) {
        super(message, errorCode, 422, errors)
    }
}