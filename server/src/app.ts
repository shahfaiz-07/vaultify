import express from "express";
import dotenv from "dotenv";  
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import fileRoutes from "./routes/file.route.js";
import adminRoutes from "./routes/admin.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config({
    path: "./.env"
});

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.get("/", (_req, res) => { // TODO: Remove this test route later
    res.send("API is running...");
});
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/admin", adminRoutes)

app.use(errorHandler);

export { app };