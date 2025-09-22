declare namespace NodeJS {
    interface ProcessEnv {
        MONGO_URI: string;
        PORT: string;
        JWT_SECRET: string;
        JWT_EXPIRATION: string;
        NODE_ENV: string;
        CORS_ORIGIN: string;
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
    }
}