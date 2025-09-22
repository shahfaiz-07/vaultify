import mongoose, { Document } from "mongoose";
import { RoleType } from "../enums/RoleType.ts";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId,
    name: string;
    email: string;
    password: string;
    role: RoleType;
    createdAt?: Date;
    updatedAt?: Date;
    matchPassword: (password: string) => Promise<boolean>;
    generateAuthToken: () => string;
}