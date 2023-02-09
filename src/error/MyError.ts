export default class MyError extends Error {
    status: number

    constructor(status = 500, message: string, errors = []) {
        super(message);
        this.status = status
    }
}