import dotenv from "dotenv";
dotenv.config({path:'../.env'})
const appConfig={
    mongoURL:process.env.MONGO_URL
}
export default appConfig