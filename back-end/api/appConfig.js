import dotenv from "dotenv";
dotenv.config({path:'../.env'})
const appConfig={
    mongoURL:process.env.MONGO_URL,
    serverPort:process.env.SERVER_PORT,
    frontendURL:process.env.FRONTEND_URL,
}
export default appConfig