import type { RoleType } from "../enums/RoleType";

export interface User {
    _id: string;
    email: string;
    name: string;
    role: RoleType;
    createdAt: Date;
}