// import mongoose from "mongoose";
// import appConfig from "./appConfig.js";
// const connectDb = () => {
//   mongoose.connect(appConfig.mongoURL).then(()=>console.log("connected to db succesfully")).
//   catch(error=>{
//     if (error.code==="ECONNREFUSED") {
//     console.error("No internet connection", error)
//   } else {
//      console.error("Error connecting to DB:", error)}
//   }
// )
// };

// export default connectDb;
import mongoose from "mongoose";
import appConfig from "./appConfig.js";

const connectDb = async () => {
  try {
    await mongoose.connect(appConfig.mongoURL).then(()=>console.log("connected to db succesfully"));
    
    // Force recreation of indexes //you should not include it in your production environment
    // await mongoose.model('User').collection.dropIndexes(); //dropIndexes removed all existing indexes from the User collection, including the unique index on the email field. 
    // await mongoose.model('User').createIndexes(); //createIndexes recreated all indexes defined in your Mongoose schema, ensuring that the unique constraint was properly applied again.
    
    // console.log("Connected to DB successfully");
    
    // // Debug: Log current indexes to verify
    // const indexes = await mongoose.model('User').collection.getIndexes();
    // console.log('Current User collection indexes:', indexes);
    
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.error("No internet connection", error);
    } else {
      console.error("Error connecting to DB:", error);
    }
    throw error;
  }
};

export default connectDb;