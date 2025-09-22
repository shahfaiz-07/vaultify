import mongoose, { Schema } from "mongoose";
import { IFile } from "../types/models/File.js";
import { MimeType } from "../types/enums/MimeType.js";

const fileSchema = new Schema<IFile>({
    filename: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    mimetype: { type: String, enum: Object.values(MimeType), required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublic: { type: Boolean, default: false },
    downloadCount: { type: Number, default: 0 },
}, {
    timestamps: true
})

const File = mongoose.model<IFile>("File", fileSchema);
export default File;