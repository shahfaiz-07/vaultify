import { IUser } from "../models/User.js";

export interface GetUserDetailsResponse {
    user: Partial<IUser>;
}