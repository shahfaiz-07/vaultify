import mongoose, { Document } from "mongoose";
import { MimeType } from "../enums/MimeType.ts";

export interface IFile extends Document {
    _id: mongoose.Types.ObjectId;
    filename: string;
    url: string;
    publicId: string;
    mimetype: MimeType;
    size: number; // size in bytes
    uploadedBy: mongoose.Types.ObjectId; // Reference to the User model
    isPublic: boolean;
    downloadCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}