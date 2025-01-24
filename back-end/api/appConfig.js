//appConfig
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Get the current directory of the module (similar to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve the absolute path to the .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

const appConfig = {
    mongoURL: process.env.MONGO_URL,
    serverPort: process.env.SERVER_PORT,
    frontendURL: process.env.FRONTEND_URL,
    userSecretKey: process.env.USER_SECRET_KEY,
    adminSecretKey: process.env.ADMIN_SECRET_KEY,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
    nodeEnv: process.env.NODE_ENV,
    cookieDomain: process.env.COOKIE_DOMAIN,
    refreshTokenSecretKey:process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpirationTime:process.env.REFRESH_TOKEN_EXPIRY,
};


export default appConfig;