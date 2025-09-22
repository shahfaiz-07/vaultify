import { Request, Response } from "express";
import { UploadFileDTO, UpdateFileMetadataDTO } from "../types/dtos/file.dtos.js";
import { ApiResponse } from "../types/global/ApiResponse.js";
import { removeFromCloudinary, uploadOnCloudinary } from "../lib/cloudinary.js";
import { STATUS_CODES } from "../constants.js";
import File from "../models/file.model.js";
import { DeleteFileParams, DownloadFileParams, DownloadFileResponse, FileUploadResponse, GetFileByIdParams, GetFileByIdResponse, GetPublicFilesResponse, GetStatsResponse, GetUserFilesResponse, UpdateFileMetadataParams } from "../types/controllers/FileControllerTypes.js";
import { getResourceType } from "../utils/getResourceType.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import { RoleType } from "../types/enums/RoleType.js";

export const uploadFile = asyncHandler(async (request: Request<{}, {}, UploadFileDTO>, response: Response) => {

    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated."]
        });
    }

    if (!request.body?.filename || !request.body?.isPublic) {
        throw new AppError("Filename and isPublic are required.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: [!request.body?.filename && "Filename is required.", !request.body?.isPublic && "isPublic is required."].filter(Boolean)
        });
    }

    const { filename, isPublic } = request.body;

    if (!request.file || !request.file.path) {
        throw new AppError("No file uploaded.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["No file uploaded."]
        });
    }

    const cloudinaryResponse = await uploadOnCloudinary(request.file.path);

    if (!cloudinaryResponse) {
        throw new AppError("File upload failed.", {
            statusCode: STATUS_CODES.SERVICE_UNAVAILABLE,
            errors: ["Could not upload file. Please try again later."]
        });
    }

    const file = await File.create({
        filename,
        url: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
        mimetype: request.file.mimetype,
        size: cloudinaryResponse.bytes,
        uploadedBy: request.user._id,
        isPublic,
    });

    if (!file) {
        throw new AppError("File upload failed.", {
            statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
            errors: ["Could not save file metadata. Please try again later."]
        });
    }

    return response.status(STATUS_CODES.CREATED).json({
        message: "File uploaded successfully.",
        success: true,
        data: { file }
    } as ApiResponse<FileUploadResponse>);
});

export const deleteFile = asyncHandler(async (request: Request<DeleteFileParams>, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated."]
        });
    }

    if (!request.params?.fileId) {
        throw new AppError("fileId is required.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["fileId is required."]
        });
    }

    const { fileId } = request.params;

    if (!isValidObjectId(fileId)) {
        throw new AppError("Invalid fileId.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["Invalid fileId."]
        });
    }

    const file = await File.findById(fileId);

    if (!file) {
        throw new AppError("File not found.", {
            statusCode: STATUS_CODES.NOT_FOUND,
            errors: ["File not found."]
        });
    }

    if (file.uploadedBy.toString() !== request.user._id.toString()) {
        throw new AppError("Forbidden.", {
            statusCode: STATUS_CODES.FORBIDDEN,
            errors: ["You are not allowed to delete this file."]
        });
    }

    const references = await File.countDocuments({
        publicId: file.publicId,
        _id: { $ne: file._id }
    })

    if (references === 0) {
        const resourceType = getResourceType(file.mimetype);
        await removeFromCloudinary(file.publicId, resourceType);
    }

    await file.deleteOne();

    return response.status(STATUS_CODES.OK).json({
        message: "File deleted successfully.",
        success: true,
    } as ApiResponse<null>);
});

export const getUserFiles = asyncHandler(async (request: Request, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated."]
        });
    }

    const files = await File.find({ uploadedBy: request.user._id }).select("-__v -url -publicId").sort({ createdAt: -1 });

    return response.status(STATUS_CODES.OK).json({
        message: "Files fetched successfully.",
        success: true,
        data: { files }
    } as ApiResponse<GetUserFilesResponse>);
});

export const updateFileMetadata = asyncHandler(async (request: Request<UpdateFileMetadataParams, {}, UpdateFileMetadataDTO>, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated."]
        });
    }

    if (!request.params?.fileId) {
        throw new AppError("fileId is required.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["fileId is required."]
        });
    }

    const { fileId } = request.params;

    if (!isValidObjectId(fileId)) {
        throw new AppError("Invalid fileId.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["Invalid fileId."]
        });
    }

    console.log({requestBody: request.body})

    if (!request.body?.filename || request.body?.isPublic == undefined) {
        throw new AppError("Filename and isPublic are required.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: [!request.body?.filename && "Filename is required.", request.body?.isPublic == undefined && "isPublic is required."].filter(Boolean)
        });
    }

    const { filename, isPublic } = request.body;

    const file = await File.findById(fileId);

    if (!file) {
        throw new AppError("File not found.", {
            statusCode: STATUS_CODES.NOT_FOUND,
            errors: ["File not found."]
        });
    }

    if (file.uploadedBy.toString() !== request.user._id.toString()) {
        throw new AppError("Forbidden.", {
            statusCode: STATUS_CODES.FORBIDDEN,
            errors: ["You are not allowed to update this file."]
        });
    }

    file.isPublic = isPublic;
    file.filename = filename;
    await file.save();

    return response.status(STATUS_CODES.OK).json({
        message: "File metadata updated successfully.",
        success: true
    } as ApiResponse<null>);
});

export const getFileById = asyncHandler(async (request: Request<GetFileByIdParams>, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated."]
        });
    }

    if (!request.params?.fileId) {
        throw new AppError("fileId is required.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["fileId is required."]
        });
    }

    const { fileId } = request.params;

    if (!isValidObjectId(fileId)) {
        throw new AppError("Invalid fileId.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["Invalid fileId."]
        });
    }

    const file = await File.findById(fileId).populate("uploadedBy", "name");

    if (!file) {
        throw new AppError("File not found.", {
            statusCode: STATUS_CODES.NOT_FOUND,
            errors: ["File not found."]
        });
    }

    if (file.uploadedBy.toString() !== request.user._id.toString() && !file.isPublic && request.user.role !== RoleType.ADMIN) {
        throw new AppError("Forbidden.", {
            statusCode: STATUS_CODES.FORBIDDEN,
            errors: ["You are not authorized to access this file!"]
        });
    }

    return response.status(STATUS_CODES.OK).json({
        message: "File fetched successfully.",
        success: true,
        data: { file }
    } as ApiResponse<GetFileByIdResponse>);
});

export const downloadFile = asyncHandler(async (request: Request<DownloadFileParams>, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated."]
        });
    }

    if (!request.params?.fileId) {
        throw new AppError("fileId is required.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["fileId is required."]
        });
    }

    const { fileId } = request.params;

    if (!isValidObjectId(fileId)) {
        throw new AppError("Invalid fileId.", {
            statusCode: STATUS_CODES.BAD_REQUEST,
            errors: ["Invalid fileId."]
        });
    }

    const file = await File.findById(fileId);

    if (file.uploadedBy.toString() !== request.user._id.toString() && !file.isPublic && request.user.role !== RoleType.ADMIN) {
        throw new AppError("Forbidden.", {
            statusCode: STATUS_CODES.FORBIDDEN,
            errors: ["You are not authorized to access this file!"]
        });
    }

    file.downloadCount += 1;
    await file.save();

    return response.status(STATUS_CODES.OK).json({
        message: "File download link fetched successfully.",
        success: true,
        data: { url: file.url, filename: file.filename, mimetype: file.mimetype }
    } as ApiResponse<DownloadFileResponse>);
});

export const getStats = asyncHandler(async (request: Request, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated."]
        });
    }

    const allFiles = await File.find({ uploadedBy: request.user._id });
    const [
        totalStorageUsed, // TODO: consider optimized space based on references
        totalDownloadCount,
        totalPublicFiles,
        totalFiles
    ] = allFiles.reduce((acc, file) => [
        acc[0] + file.size,
        acc[1] + file.downloadCount,
        acc[2] + (file.isPublic ? 1 : 0),
        acc[3] + 1
    ],
        [0, 0, 0, 0]);

    return response.status(STATUS_CODES.OK).json({
        message: "User statistics fetched successfully.",
        success: true,
        data: {
            totalStorageUsed,
            totalDownloadCount,
            totalPublicFiles,
            totalFiles
        }
    } as ApiResponse<GetStatsResponse>);
});

export const getPublicFiles = asyncHandler(async (request: Request, response: Response) => {
    if (!request.user) {
        throw new AppError("Unauthorized", {
            statusCode: STATUS_CODES.UNAUTHORIZED,
            errors: ["User not authenticated."]
        });
    }
    
    const files = await File.find({ isPublic: true }).select("-__v -url -publicId").sort({ createdAt: -1 }).populate("uploadedBy", "name");

    return response.status(STATUS_CODES.OK).json({
        message: "Public files fetched successfully.",
        success: true,
        data: { files }
    } as ApiResponse<GetPublicFilesResponse>);
});