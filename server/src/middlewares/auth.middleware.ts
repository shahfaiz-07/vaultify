import { NextFunction, Request } from "express";
import { STATUS_CODES } from "../constants.js";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth/JwtPayload.js";
import { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { RoleType } from "../types/enums/RoleType.js";

export const authMiddleware = asyncHandler(async (request: Request, _, next: NextFunction) => {
    const token = request.headers?.authorization?.replace("Bearer ", "") ?? request.cookies.jwt;
    
    if (!token) {
        throw new AppError("Authentication token is missing - please log in.", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["Authentication token is required"]
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded._id || !decoded.role || !isValidObjectId(decoded._id)) {
        throw new AppError("Invalid authentication token", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["Invalid authentication token"]
        });
    }

    const user = await User.findById(decoded._id).select("-password");

    if (!user || user.role !== decoded.role) {
        throw new AppError("Invalid authentication token", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["Invalid authentication token"]
        });
    }

    request.user = user;
    next();
});

export const isAdmin = (request: Request, _: any, next: NextFunction) => {
    if(!request.user || request.user.role !== RoleType.ADMIN) {
        throw new AppError("You do not have permission to perform this action", {
            statusCode: STATUS_CODES.FORBIDDEN,
            errors: ["Insufficient permissions"]
        });
    }
    next();
}