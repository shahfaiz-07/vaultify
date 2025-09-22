import type { RoleType } from "../../enums/RoleType";

export interface RegisterUserDTO {
    name: string;
    email: string;
    password: string;
    role: RoleType;
}

export interface LoginUserDTO {
    email: string;
    password: string;
}

export interface UploadFileDTO {
    filename: string;
    isPublic: boolean;
}

export interface UpdateFileMetadataDTO {
    filename: string;
    isPublic: boolean;
}