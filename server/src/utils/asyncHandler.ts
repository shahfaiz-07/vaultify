import { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler = (requestHandler: RequestHandler) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(request, response, next)).catch(next);
    }
}