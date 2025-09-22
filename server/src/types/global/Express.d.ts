import { IUser } from "../models/User.js";

declare global {
    namespace Express {
        interface Request {
            user?: Partial<IUser>; // attach any user-related info
        }
    }
}