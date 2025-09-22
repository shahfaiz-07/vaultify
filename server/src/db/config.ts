import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("MongoDB connected successfully !!🎉".bgGreen);
        console.log(`DB host : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:".bgRed);
        console.log(`ERROR :: ${error}`);
        process.exit(1); // Exit the process with failure
    }
}

export const disconnectDB = async () => {   
    try {
        await mongoose.connection.close();
        console.log("MongoDB disconnected successfully !!".bgYellow);
    } catch (error) {
        console.error("Error disconnecting from MongoDB:".bgRed);
        console.log(`ERROR :: ${error}`);
        process.exit(1); // Exit the process with failure
    }
}