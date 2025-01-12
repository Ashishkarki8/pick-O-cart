import bcrypt from "bcryptjs";
import { User } from "../../models/model.js";
import userValidator from "../../validators/userValidator.js";
import jwt from 'jsonwebtoken';
import appConfig from "../../appConfig.js";

export const registerUser = async (req, res) => {
  try {
    // Validate request body using Joi
    const { error, value } = userValidator.validate(req.body, {
      abortEarly: false, // Report all errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
    }

    const { userName, email, password } = value;

    // Capitalize the first letter of the username after validation
    const formattedUserName =
      userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email already exists.Please recheck your Email.",
        });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create and save the new user with the properly formatted username
    const newUser = new User({
      userName: formattedUserName,
      email,
      password: hashedPassword,
    });
    let response = await newUser.save();

    // Send successful response
    res
      .status(200)
      .json({
        success: true,
        message: "User registered successfully.",
        data: response,
      });
  } catch (error) {
    // Handle database or server error
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered." });
    }

    console.error("Error during registration:", error.message);
    res.status(500).json({ success: false, message: "Some error occurred." });
  }
};



export const loginUser= async (req, res) => {
  try {
    // Validate request body using Joi

    const { email, password } = req.body;
    const checkUser = await User.findOne({ email });

    // console.log(checkUser); //it contains password as weel for the email we are searching
    if (!checkUser) {
            return res.status(404).json({
              success: false,
              message: "User doesn't exist! Please register first",
            });
          }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    ); //user typed password ,dbpassword if matched gives true
    if (!checkPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password, please try again",
      });
    }

    const token = jwt.sign(
      { id: checkUser.id, role: checkUser.role, email: checkUser.email },
      appConfig.userSecretKey,
      { expiresIn: appConfig.jwtExpirationTime }
    );
  //  console.log(token);
    res.cookie("token", token, { httpOnly: true, secure: false }).json({    //secure: false should be true later
      success: true,
      message: "Login succesfull",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser.id,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ success: false, message: "Some error occurred." });
  }
};



 export const logoutUser = (req, res) => {
  // Clear the cookie with the name 'token'
 return res.clearCookie('token').json({
    success: true,
    message: "Logged out successfully"
  });
};

// export const authMiddleware=async(req,res,next) => { //get method
//   const token=req.cookies.token;
//  // console.log(token);
//   if(!token){
//     return res.status(401).json({
//       success:false,
//       message:'Un-authorised User'
//     })
//   }
//   try {
//     const decodeToken= jwt.verify(token,appConfig.userSecretKey);
//     //console.log(decodeToken)
//     req.user=decodeToken;
//     next();     //middlewarec call bhaisakeypachhi ko function
//   } catch (error) {
//      return res.status(401).json({success:false, message:'Un-authorised User'});
//   }
// } 

export const authMiddleware = async (req, res, next) => {
  try {
      const token = req.cookies?.token;

      if (!token) {
          return res.status(401).json({
              success: false,
              message: 'Unauthorized: No token provided.',
          });
      }

      // Verify and decode token
      const decodedToken = jwt.verify(token, appConfig.userSecretKey);
     
      // Check user existence in the database
      const user = await User.findById(decodedToken.id); // Assuming `id` is in the token payload
      if (!user) {
          return res.status(401).json({
              success: false,
              message: 'Unauthorized: User not found.',
          });
      }

      // Check if the user is active (optional, based on app requirements)
      /* if (!user.isActive) {
          return res.status(403).json({
              success: false,
              message: 'Unauthorized: User is deactivated.',
          });
      } */

      // Attach user data to the request object
      req.user = user;

      next(); // Proceed to the next middleware or route handler
  } catch (error) {
      console.error("Authentication Middleware Error:", error.message);
      return res.status(401).json({
          success: false,
          message: 'Unauthorized: Invalid or expired token.',
      });
  }
};



// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';  // Use dotenv to load environment variables

// dotenv.config();  // Load environment variables from .env file

// export const loginUser = async (req, res) => {
//   try {
//     // Validate request body using Joi (you may want to implement Joi validation here)

//     const { email, password } = req.body;
    
//     // Check if the user exists
//     const checkUser = await User.findOne({ email });

//     if (!checkUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User doesn't exist! Please register first",
//       });
//     }

//     // Check if password is correct
//     const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);

//     if (!checkPasswordMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Incorrect password, please try again",
//       });
//     }

//     // Generate JWT token with a secret key from environment variables
//     const token = jwt.sign(  //either we can use jwt or session
//       { id: checkUser.id, role: checkUser.role, email: checkUser.email },
//       process.env.JWT_SECRET_KEY, // Use environment variable for secret key
//       { expiresIn: "60m" }  // Consider the expiration time here
//     );

//     // Cookie options - dynamically set `secure` based on environment
//     const cookieOptions = {
//       httpOnly: true,  // Ensures cookie is sent only via HTTP requests
//       secure: process.env.NODE_ENV === 'production',  // Only secure in production
//       sameSite: 'strict',  // Helps prevent CSRF attacks
//       maxAge: 60 * 60 * 1000,  // Cookie expires in 1 hour
//     };

//     // Send token in response as cookie and user data as response body
//     res.cookie("token", token, cookieOptions).json({
//       success: true,
//       message: "Login successful",
//       user: {
//         email: checkUser.email,
//         role: checkUser.role,
//         id: checkUser.id,
//       },
//     });
//   } catch (error) {
//     console.error("Error during login:", error.message);
//     res.status(500).json({ success: false, message: "Some error occurred." });
//   }
// };



// before skipMiddlewareFunctionimport bcrypt from "bcryptjs";
// import { User } from "../../models/model.js";
// import userValidator from "../../validators/userValidator.js";

// export const registerUser = async (req, res) => {
//   try {
//     const { error, value } = userValidator.validate(req.body, {
//       abortEarly: false, // Report all errors
//       stripUnknown: true // Remove unknown fields
//     });

//     if (error) {
//       return res.status(400).json({
//         success: false,
//         errors: error.details.map(detail => ({
//           field: detail.path.join('.'),
//           message: detail.message
//         }))
//       });
//     }

//     const { userName, email, password } = value;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "Email already exists." });
//     }

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const newUser = new User({ userName, email, password: hashedPassword });

//     let response = await newUser.save();
//     res.status(200).json({ success: true, message: "User registered successfully.", data: response });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ success: false, message: "Email is already registered." });
//     }

//     console.error("Error during registration:", error.message);
//     res.status(500).json({ success: false, message: "Some error occurred." });
//   }
// };









//progress here