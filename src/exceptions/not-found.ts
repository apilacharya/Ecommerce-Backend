import { ErrorCode, HttpException } from "./root";

export class NotFoundException extends HttpException {
    constructor(message: string, errorCode: number, errors? : any) {
        super(message, errorCode, 404, errors)
    }
}