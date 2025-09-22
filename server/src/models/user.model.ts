import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/models/User.js";
import { RoleType } from "../types/enums/RoleType.js";
import bcrypt from "bcrypt";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth/JwtPayload.js";

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, enum: Object.values(RoleType), default: RoleType.USER },
}, {
    timestamps: true
})

userSchema.pre<IUser>("save", async function (next: NextFunction) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAuthToken = function (): string {
    return jwt.sign({
        _id: this._id,
        role: this.role
    } as JwtPayload, 
    process.env.JWT_SECRET, 
    { expiresIn: Number(process.env.JWT_EXPIRATION) });
}

const User = mongoose.model<IUser>("User", userSchema);
export default User;