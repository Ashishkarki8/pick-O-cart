import dotenv from "dotenv";
dotenv.config({path:'../.env'})
const appConfig={
    mongoURL:process.env.MONGO_URL,
    serverPort:process.env.SERVER_PORT,
    frontendURL:process.env.FRONTEND_URL,
    userSecretKey:process.env.USER_SECRET_KEY,
    adminSecretKey:process.env.ADMIN_SECRET_KEY,
    jwtExpirationTime:process.env.JWT_EXPIRATION_TIME

}
export default appConfig