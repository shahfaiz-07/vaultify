import type { MimeType } from "../enums/MimeType";
import type { User } from "./User";

export interface UserFile {
    _id: string;
    filename: string;
    uploadedBy: string | User | null;
    isPublic: boolean;
    downloadCount: number;
    createdAt: Date;
    updatedAt: Date;
    size: number;
    mimetype: MimeType;
}