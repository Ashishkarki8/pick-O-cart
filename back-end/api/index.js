import express from "express";
import connectDb from "./connectDb.js";

const app=express()


app.listen(9000,()=>{
 console.log("server is running on port 9000")
})
connectDb()

