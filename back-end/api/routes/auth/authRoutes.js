import { Router } from "express";
import {
  authMiddleware,
  loginUser,
  registerUser,
} from "../../controllers/auth/authController.js";

let authRouter = Router();

authRouter.post("/register", registerUser); //  kunchain frontend ko child page bata data pathauni ho rah kun ,function ley db mah save garcha
authRouter.post("/login", loginUser);
authRouter.get("/check-auth", authMiddleware, async (req, res) => {
  //auth midddler ley token chaki chaina check garcha rah cha bhaney token ko data lai get garera middleware next mah pathaucha
  try {
    // Extract user from middleware-processed request
    const user = req.user;
    // console.log("sending data of user from next middleware to frontend", user)
    // Validate user object
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User data not found.",
      });
    }

    // Log user for debugging (avoid logging sensitive data)
    // console.log("Authenticated User Details:", user);

    // Return success response
    res.status(200).json({
      success: true,
      message: "User authenticated successfully.",
      user, // Send user data in response
    });
  } catch (error) {
    // Catch unexpected errors
    console.error("Error in /check-auth route:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
// authRouter.post('/refresh-token', refreshAccessToken);

export default authRouter;
