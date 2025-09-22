import mongoose, { mongo } from "mongoose";
import { RoleType } from "../enums/RoleType.js";

export interface JwtPayload {
    _id: mongoose.Types.ObjectId;
    role: RoleType;
}