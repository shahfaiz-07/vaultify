import { request, Request, Response } from "express";
import { LoginUserDTO, RegisterUserDTO } from "../types/dtos/user.dtos.js";
import { STATUS_CODES } from "../constants.js";
import { ApiResponse } from "../types/global/ApiResponse.js";
import User from "../models/user.model.js";
import { GetUserDetailsResponse } from "../types/controllers/UserControllerTypes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const registerUser = asyncHandler(async (request: Request<{}, {}, RegisterUserDTO>, response: Response) => {

    if (!request.body?.name || !request.body?.email || !request.body?.password || !request.body?.role) {
        throw new AppError("All fields are required.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: [!request.body?.name && "Name is required.", !request.body?.email && "Email is required.", !request.body?.password && "Password is required.", !request.body?.role && "Role is required."].filter(Boolean)
        });
    }

    const { name, email, password, role } = request.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("Email already in use.", {
            statusCode: STATUS_CODES.CONFLICT,
            errors: ["A user with this email already exists."]
        });
    }

    const newUser = await User.create({ name, email, password, role });

    if (!newUser) {
        throw new AppError("User registration failed.", {
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
            errors: ["Could not create user. Please try again later."]
        });
    }

    return response.status(STATUS_CODES.CREATED).json({
        message: "User registered successfully.",
        success: true
    } as ApiResponse<null>);
});


export const loginUser = asyncHandler(async (request: Request<{}, {}, LoginUserDTO>, response: Response) => {

    if (!request.body?.email || !request.body?.password) {
        throw new AppError("Email and password are required.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: [!request.body?.email && "Email is required.", !request.body?.password && "Password is required."].filter(Boolean)
        });
    }

    const { email, password } = request.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError("Invalid credentials", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["Invalid credentials"]
        });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new AppError("Invalid credentials", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["Invalid credentials"]
        });
    }

    const token = user.generateAuthToken();

    response.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production", // Use secure cookies in production
        sameSite: process.env.NODE_ENV == "production" ? "none" : "strict", // SameSite=none for cross-site cookies in production
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return response.status(STATUS_CODES.OK).json({
        message: "User logged in successfully",
        success: true
    } as ApiResponse<null>);

});

export const logoutUser = asyncHandler((request: Request, response: Response) => {
    response.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });

    return response.status(STATUS_CODES.OK).json({
        message: "User logged out successfully",
        success: true
    } as ApiResponse<null>);
});

export const getUserDetails = asyncHandler(async (request: Request, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated."]
        });
    }

    const user = await User.findById(request.user._id).select("-password -__v -updatedAt");

    if (!user) {
        throw new AppError("User not found", {
            statusCode: STATUS_CODES.NOT_FOUND,
            errors: ["User does not exist."]
        });
    }

    return response.status(STATUS_CODES.OK).json({
        message: "User details fetched successfully.",
        success: true,
        data: { user }
    } as ApiResponse<GetUserDetailsResponse>);
});