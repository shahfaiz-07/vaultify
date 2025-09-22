import { IFile } from "../models/File.js";
import { IUser } from "../models/User.js";

export interface GetFilesByUserIdParams {
    userId?: string;
}

export interface GetFilesByUserIdResponse {
    files: IFile[];
}

export interface GetAllFilesResponse {
    files: (IFile & { uploadedBy: IUser })[];
}

export interface GetUserStatsParams {
    userId?: string;
}

export interface GetUserStatsResponse {
    totalStorageUsed: number;
    totalFiles: number;
    totalPublicFiles: number;
    totalDownloadCount: number;
    user: IUser;
}

export interface GetAllUsersResponse {
    users: IUser[];
}

export interface GetUserByIdParams {
    userId?: string;
}

export interface GetUserByIdResponse {
    user: IUser;
}

export interface GetStorageStatsResponse {
    totalLogicalSize: number;  // in bytes
    totalPhysicalSize: number; // in bytes
    storageSaved: number;      // in bytes
    totalFilesUploaded: number;
    uniqueFilesStored: number;
    mostDuplicatedFile: {
        publicId: string;
        count: number;
        url: string;
    } | null;
    totalUsers: number;
    topUploader: {
        userId: string;
        uploads: number;
    } | null;
}