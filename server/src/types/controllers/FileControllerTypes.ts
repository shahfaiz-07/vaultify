import { IFile } from "../models/File.js";

export interface FileUploadResponse {
    file: IFile;
}

export interface GetUserFilesResponse {
    files: Partial<IFile>[];
}

export interface DeleteFileParams {
    fileId?: string;
}

export interface UpdateFileMetadataParams {
    fileId?: string;
}

export interface GetFileByIdParams {
    fileId?: string;
}

export interface GetFileByIdResponse {
    file: IFile;
}

export interface DownloadFileParams {
    fileId?: string;
}

export interface DownloadFileResponse {
    url: string;
    filename: string;
    mimetype: string;
}

export interface GetStatsResponse {
    totalFiles: number;
    totalStorageUsed: number;
    totalPublicFiles: number;
    totalDownloadCount: number;
}

export interface GetPublicFilesResponse {
    files: Partial<IFile>[];
}