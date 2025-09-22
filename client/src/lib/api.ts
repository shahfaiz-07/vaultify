import mime from "mime-types";
import type { DownloadFileResponse, GetAllFilesResponse, GetAllUsersResponse, GetFileByIdResponse, GetFilesByUserIdResponse, GetFilesResponse, GetFileStatsResponse, GetPublicFilesResponse, GetStorageStatsResponse, GetUserResponse, GetUserStatsResponse, LoginUserDTO, MimeType, RegisterUserDTO, UpdateFileMetadataDTO } from "../types";
import { apiClient } from "./axios";

export const registerUser = async (registerData: RegisterUserDTO) => {
    return await apiClient.post<null>('/users/register', registerData);
}

export const loginUser = async (loginData: LoginUserDTO) => {
    return await apiClient.post<null>('/users/login', loginData)
}

export const getUser = async () => {
    return await apiClient.get<GetUserResponse>('/users/me').then(res => res.data).catch(() => null);
}

export const logoutUser = async () => {
    return await apiClient.post<null>('/users/logout');
}

export const getUserFiles = async () => {
    return await apiClient.get<GetFilesResponse>('/files/user-files').then(res => res.data).catch(() => null);
}

export const getFileStats = async () => {
    return await apiClient.get<GetFileStatsResponse>('/files/stats').then(res => res.data).catch(() => null);
}

export const downloadFile = async (fileId: string, fileName: string, fileType: MimeType): Promise<boolean> => {
    const response = await apiClient.get<DownloadFileResponse>(`/files/f/${fileId}/download`).then(res => res.data).catch(() => null);
    if (!response) return false;

    const fileRes = await fetch(response.url);
    const blob = await fileRes.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);

    const ext = mime.extension(fileType) || "bin";
    link.setAttribute("download", `${fileName}.${ext}`);

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(link.href);
    return true;
}

export const deleteFile = async (fileId: string) => {
    return await apiClient.delete<null>(`/files/delete/${fileId}`);
}

export const updateFile = async ({fileId, formData}: {fileId: string, formData: UpdateFileMetadataDTO}) => {
    return await apiClient.patch<null>(`/files/update/${fileId}`, formData);
}

export const uploadFile = async (fileData: FormData) => {
    return await apiClient.post<null>('/files/upload', fileData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const getAllUsers = async () => {
    return await apiClient.get<GetAllUsersResponse>('/admin/users').then(res => res.data).catch(() => null);
}

export const getUserById = async (userId: string) => {
    return await apiClient.get<GetUserStatsResponse>(`/admin/stats/${userId}`).then(res => res.data).catch(() => null);
}

export const getFilesByUserId = async (userId: string) => {
    return await apiClient.get<GetFilesByUserIdResponse>(`/admin/files/${userId}`).then(res => res.data).catch(() => null);
}

export const getStorageStats = async () => {
    return await apiClient.get<GetStorageStatsResponse>('/admin/stats').then(res => res.data).catch(() => null);
}

export const getAllFiles = async () => {
    return await apiClient.get<GetAllFilesResponse>('/admin/files').then(res => res.data).catch(() => null);
}

export const getPublicFiles = async () => {
    return await apiClient.get<GetPublicFilesResponse>('/files/public').then(res => res.data).catch(() => null);
}

export const getFileById = async (fileId: string) => {
    return await apiClient.get<GetFileByIdResponse>(`/files/f/${fileId}`).then(res => res.data).catch(() => null);
}