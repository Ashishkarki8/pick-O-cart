import { model } from "mongoose";
import userSchema from "../schema/userSchema.js";


export const User=model("User",userSchema)
