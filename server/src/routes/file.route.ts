import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteFile, downloadFile, getFileById, getPublicFiles, getStats, getUserFiles, updateFileMetadata, uploadFile } from "../controllers/file.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router
    .get("/user-files", getUserFiles)
    .post("/upload", upload.single("file"), uploadFile)
    .delete("/delete/:fileId", deleteFile)
    .patch("/update/:fileId", updateFileMetadata)
    .get("/f/:fileId", getFileById)
    .get("/f/:fileId/download", downloadFile)
    .get("/stats", getStats)
    .get("/public", getPublicFiles);

export default router;