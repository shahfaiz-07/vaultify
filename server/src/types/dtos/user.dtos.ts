import { RoleType } from "../enums/RoleType.js";

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