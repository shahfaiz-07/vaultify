import { AxiosError } from "axios";
import type { ApiResponse } from "./response";

export class ApiError extends AxiosError<ApiResponse<null>> {
    public statusCode: number;
    public data?: ApiResponse<null>;

    constructor(message: string, statusCode: number, data?: ApiResponse<null>) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.name = "ApiError";
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}