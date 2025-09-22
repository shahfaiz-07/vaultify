import { Router } from "express";
import { getUserDetails, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router
    .post("/register", registerUser)
    .post("/login", loginUser)
    .post("/logout", logoutUser)
    .get("/me", authMiddleware, getUserDetails);

export default router;