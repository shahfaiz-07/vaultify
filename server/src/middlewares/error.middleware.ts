import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { ApiResponse } from "../types/global/ApiResponse.js";
import { STATUS_CODES } from "../constants.js";

export const errorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            message: error.message,
            errors: error.errors,
            success: false
        } as ApiResponse<null>);
    }

    if(error?.code === 'LIMIT_FILE_SIZE') {
        return response.status(STATUS_CODES.BAD_REQUEST).json({
            message: "File size limit exceeded.",
            errors: ["File size limit exceeded. File should be less than 5MB."],
            success: false
        } as ApiResponse<null>);
    }
    return response.status(500).json({
        message: "Internal Server Error",
        errors: [error.message || "An unexpected error occurred"],
        success: false
    } as ApiResponse<null>);
}