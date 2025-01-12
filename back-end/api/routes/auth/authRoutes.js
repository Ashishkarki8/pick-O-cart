import { Router } from "express";
import { authMiddleware, loginUser, logoutUser, registerUser } from "../../controllers/auth/authController.js";


let authRouter=Router();

authRouter.post('/register',registerUser) //  kunchain frontend ko child page bata data pathauni ho rah kun ,function ley db mah save garcha
authRouter.post('/login',loginUser);
authRouter.post('/logout',logoutUser);
authRouter.get('/check-auth', authMiddleware, async (req, res) => {
    try {
        // Extract user from middleware-processed request
        const user = req.user;

        // Validate user object
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User data not found.',
            });
        }

        // Log user for debugging (avoid logging sensitive data)
        console.log("Authenticated User Details:", user);

        // Return success response
        res.status(200).json({
            success: true,
            message: 'User authenticated successfully.',
            user,
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


export default authRouter