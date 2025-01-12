import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from "express"; //JSON is the function present in the "express" module and express is the obj which can use the module
import appConfig from "./appConfig.js";
import connectDb from "./connectDb.js";
import corsOptions from "./corsConfig.js";
import authRouter from './routes/auth/authRoutes.js';




const app=express()


app.listen(appConfig.serverPort,()=>{
 console.log("server is running on port 9000")
})

app.use(cors(corsOptions))              //cors lai use gareko rah cors function ma corsOptions (obj) pass gareko 
app.options('*', cors(corsOptions));   // Handle preflight requests globally
app.use(cookieParser())
app.use(express.json())               //express.json()  



app.use("/api/auth/",authRouter)  // api/auth/register with post then register user


connectDb()

