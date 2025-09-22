export class AppError extends Error {
    statusCode: number;
    errors: string[];
    constructor(message: string, { statusCode = 500, errors = [] }: { statusCode: number; errors?: string[] }) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain, needed for custom error classes. You can do AppError.prototype but it will fail if you extend another class from AppError.
        Error.captureStackTrace(this); // capture stack trace - cleaner stack traces
    }
}