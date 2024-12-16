import mongoose from "mongoose";
import appConfig from "./appConfig.js";
const connectDb = () => {
  mongoose.connect(appConfig.mongoURL).then(()=>console.log("connected to db succesfully")).catch(error=>{console.error("Error connecting to DB:", error)})
};

export default connectDb;
