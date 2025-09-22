import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
import { getAllFiles, getAllUsers, getFilesByUserId, getStorageStats, getUserStats } from "../controllers/admin.controller.js";

const router = Router();

router.use(authMiddleware, isAdmin);

router
    .get("/files/:userId", getFilesByUserId)
    .get("/stats/:userId", getUserStats)
    .get("/users", getAllUsers)
    .get("/files", getAllFiles)
    .get("/stats", getStorageStats);

export default router;