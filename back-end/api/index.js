import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import appConfig from "./appConfig.js";
import connectDb from "./connectDb.js";
import { applyCorsAndSecurity } from "./corsConfig.js";
import authRouter from "./routes/auth/authRoutes.js";
const app = express();

// Apply security headers and CORS configuration
const corsMiddleware = cors(applyCorsAndSecurity(app));

// Apply middleware in the correct order
// 1. Security and CORS
app.use(corsMiddleware);
app.options('*', corsMiddleware); // Handle preflight requests

// 2. Body parsing middleware
app.use(express.json());
app.use(cookieParser());

// 3. Routes
app.use("/api/auth/", authRouter);

// Start the server
app.listen(appConfig.serverPort, () => {
    console.log(`Server is running on port ${appConfig.serverPort}`);
});

// Connect to the database
connectDb();