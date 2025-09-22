import { Request, Response } from "express"
import { asyncHandler } from "../utils/asyncHandler.js"
import { AppError } from "../utils/AppError.js";
import { STATUS_CODES } from "../constants.js";
import { GetAllUsersResponse, GetFilesByUserIdParams, GetFilesByUserIdResponse, GetStorageStatsResponse, GetUserByIdParams, GetUserByIdResponse, GetUserStatsResponse } from "../types/controllers/AdminControllerTypes.js";
import File from "../models/file.model.js";
import { ApiResponse } from "../types/global/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";

export const getFilesByUserId = asyncHandler(async (request: Request<GetFilesByUserIdParams>, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated"]
        });
    }

    if (!request.params?.userId) {
        throw new AppError("User ID is required", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["User ID parameter is missing"]
        });
    }

    const files = await File.find({ uploadedBy: request.params.userId }).select("-__v -url -publicId");

    response.status(STATUS_CODES.OK).json({
        message: "Files retrieved successfully",
        success: true,
        data: { files }
    } as ApiResponse<GetFilesByUserIdResponse>);
});

export const getUserStats = asyncHandler(async (request: Request, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated"]
        });
    }

    if (!request.params?.userId) {
        throw new AppError("User ID is required", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["User ID parameter is missing"]
        });
    }

    const { userId } = request.params;

    if (!isValidObjectId(userId)) {
        throw new AppError("Invalid User ID", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["User ID is not a valid identifier"]
        });
    }

    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
        throw new AppError("User not found", {
            statusCode: STATUS_CODES.NOT_FOUND,
            errors: ["No user found with the provided ID"]
        });
    }

    const allFiles = await File.find({ uploadedBy: userId });

    const [
        totalStorageUsed,
        totalDownloadCount,
        totalPublicFiles,
        totalFiles
    ] = allFiles.reduce((acc, file) => [
        acc[0] + file.size,
        acc[1] + file.downloadCount,
        acc[2] + (file.isPublic ? 1 : 0),
        acc[3] + 1
    ], [0, 0, 0, 0]);

    response.status(STATUS_CODES.OK).json({
        message: "User stats retrieved successfully",
        success: true,
        data: {
            totalStorageUsed,
            totalDownloadCount,
            totalPublicFiles,
            totalFiles,
            user
        }
    } as ApiResponse<GetUserStatsResponse>);
});

export const getAllUsers = asyncHandler(async (request: Request, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated"]
        });
    }

    const users = await User.find().select("-password -__v");

    response.status(STATUS_CODES.OK).json({
        message: "Users retrieved successfully",
        success: true,
        data: { users }
    } as ApiResponse<GetAllUsersResponse>);
});

export const getAllFiles = asyncHandler(async (request: Request, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated"]
        });
    }

    const files = await File.find().populate("uploadedBy", "-password -__v -createdAt -updatedAt").select("-__v -url -publicId");

    response.status(STATUS_CODES.OK).json({
        message: "Files retrieved successfully",
        success: true,
        data: { files }
    } as ApiResponse<GetFilesByUserIdResponse>);
});

export const getStorageStats = asyncHandler(async (request: Request, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated"]
        });
    }

    // Total logical size (all uploads)
    const [logical] = await File.aggregate([
        { $group: { _id: null, total: { $sum: "$size" } } }
    ]);

    // Total physical size (unique files)
    const [physical] = await File.aggregate([
        { $group: { _id: "$publicId", uniqueSize: { $first: "$size" } } },
        { $group: { _id: null, total: { $sum: "$uniqueSize" } } }
    ]);

    // Total files uploaded
    const totalFilesUploaded = await File.countDocuments();

    // Unique files stored
    const uniqueFilesStored = await File.distinct("publicId").then(arr => arr.length);

    // Most duplicated file
    const [mostDuplicatedFile] = await File.aggregate([
        { $group: { _id: "$publicId", count: { $sum: 1 }, url: { $first: "$url" } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    // Total users
    const totalUsers = await User.countDocuments();

    // Top uploader
    const [topUploader] = await File.aggregate([
        { $group: { _id: "$uploadedBy", uploads: { $sum: 1 } } },
        { $sort: { uploads: -1 } },
        { $limit: 1 }
    ]);

    console.log("Top Uploader:", topUploader);

    const totalLogical = logical?.total || 0;
    const totalPhysical = physical?.total || 0;
    const saved = totalLogical - totalPhysical;

    return response.status(STATUS_CODES.OK).json({
        message: "Storage stats fetched successfully",
        success: true,
        data: {
            totalLogicalSize: totalLogical,
            totalPhysicalSize: totalPhysical,
            storageSaved: saved,
            totalFilesUploaded,
            uniqueFilesStored,
            mostDuplicatedFile: mostDuplicatedFile
                ? { publicId: mostDuplicatedFile._id, count: mostDuplicatedFile.count, url: mostDuplicatedFile.url }
                : null,
            totalUsers,
            topUploader: topUploader
                ? { userId: topUploader._id, uploads: topUploader.uploads }
                : null
        }
    } as ApiResponse<GetStorageStatsResponse>);
});