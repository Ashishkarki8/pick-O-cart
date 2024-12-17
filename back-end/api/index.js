import cors from 'cors';
import express, { json } from "express"; //JSON is the function present in the "express" module and express is the obj which can use the module
import appConfig from "./appConfig.js";
import connectDb from "./connectDb.js";
import corsOptions from "./corsConfig.js";
import cookieParser from 'cookie-parser';




const app=express()


app.listen(appConfig.serverPort,()=>{
 console.log("server is running on port 9000")
})

app.use(cors(corsOptions))              //cors lai use gareko rah cors function ma corsOptions (obj) pass gareko 
app.options('*', cors(corsOptions));   // Handle preflight requests globally
app.use(cookieParser())
app.use(express.json())               //express.json()  
connectDb()

