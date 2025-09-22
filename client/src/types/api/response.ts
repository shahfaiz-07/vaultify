import type { User } from "../entities/User";
import type { UserFile } from "../entities/File";

export interface ApiResponse<T> {
    message: string;
    data?: T;
    success: boolean;
    errors?: string[];
}

export interface GetUserResponse {
    user: User;
}

export interface GetFilesResponse {
    files: UserFile[];
}

export interface GetFileStatsResponse {
    totalFiles: number;
    totalStorageUsed: number;
    totalPublicFiles: number;
    totalDownloadCount: number;
}

export interface DownloadFileResponse {
    url: string;
    filename: string;
    mimetype: string;
}

export interface GetAllUsersResponse {
    users: (User & {
        updatedAt: Date
    })[];
}

export interface GetUserStatsResponse {
    totalStorageUsed: number;
    totalFiles: number;
    totalPublicFiles: number;
    totalDownloadCount: number;
    user: User & {
        updatedAt: Date;
    };
}

export interface GetFilesByUserIdResponse {
    files: UserFile[];
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

export interface GetAllFilesResponse {
    files: UserFile[];
}

export interface GetPublicFilesResponse {
    files: (UserFile & {
        uploadedBy: { 
            _id: string;
            name: string 
        };
    })[];
}

export interface GetFileByIdResponse {
    file: UserFile & { 
        uploadedBy: { 
            _id: string;
            name: string 
        };
    };
}