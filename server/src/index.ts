import { app } from "./app.js"
import "colors";
import { connectDB } from "./db/config.js";

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`.bgMagenta);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database!!".bgRed);
    });