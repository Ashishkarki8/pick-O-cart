import bcrypt from "bcryptjs";
import { User } from "../../models/model.js";
import userValidator from "../../validators/userValidator.js";
import jwt from 'jsonwebtoken';
import appConfig from "../../appConfig.js";
import loginValidator from "../../validators/loginValidator.js";

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



export const loginUser  = async (req, res) => {
  try {
    
    const { error, value } = loginValidator.validate(req.body,{
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
    const { email, password } = value;

    // Validate that email and password are provided
  

    // Find the user and include the password field
    const checkUser  = await User.findOne({ email }).select('+password');
    console.log("Check User:", checkUser ); // Log the entire user object

    if (!checkUser ) {
      return res.status(404).json({
        success: false,
        message: "User  doesn't exist! Please register first",
      });
    }

    // Now checkUser .password should be defined
    console.log("Check User Password:", checkUser .password); // Log the password

    const checkPasswordMatch = await bcrypt.compare(password, checkUser .password);
    if (!checkPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password, please try again",
      });
    }
    

    const token = jwt.sign(
      { id: checkUser.id, role: checkUser.role, /* email: checkUser.email  */},
      appConfig.userSecretKey,
      { subject: "accessApi", expiresIn: appConfig.jwtExpirationTime }
    );
    console.log("JWT Expiration Time:", appConfig.jwtExpirationTime);
    console.log("Cookie Max-Age:", parseInt(appConfig.jwtExpirationTime) * 1000);
    // console.log("Generated Token:", token); // Log the generated token

    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: appConfig.nodeEnv === "production", // Set to true in production
      sameSite: "lax", // Adjust based on your needs
      // maxAge: parseInt(appConfig.jwtExpirationTime) * 1000, // Convert to milliseconds it means it stays in browsers
      path: "/", // This should allow the cookie to be sent with requests to all routes
      domain: appConfig.cookieDomain || undefined, // Should be 'localhost' in development
    }).json({
      success: true,
      message: "Login successful",
      user: {
        email: checkUser .email,
        role: checkUser .role,
        id: checkUser .id,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Some error occurred." });
  }
};


//  export const logoutUser = (req, res) => {
//   // Clear the cookie with the name 'token'
//  return res.clearCookie('token').json({
//     success: true,
//     message: "Logged out successfully"
//   });
// };

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

















// import bcrypt from "bcryptjs";
// import { User } from "../../models/model.js";
// import userValidator from "../../validators/userValidator.js";
// import jwt from "jsonwebtoken";
// import appConfig from "../../appConfig.js";
// import loginValidator from "../../validators/loginValidator.js";

// export const registerUser = async (req, res) => {
//   try {
//     // Validate request body using Joi
//     const { error, value } = userValidator.validate(req.body, {
//       abortEarly: false, // Report all errors
//       stripUnknown: true, // Remove unknown fields
//     });

//     if (error) {
//       return res.status(400).json({
//         success: false,
//         errors: error.details.map((detail) => ({
//           field: detail.path.join("."),
//           message: detail.message,
//         })),
//       });
//     }

//     const { userName, email, password } = value;

//     // Capitalize the first letter of the username after validation
//     const formattedUserName =
//       userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already exists.Please recheck your Email.",
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create and save the new user with the properly formatted username
//     const newUser = new User({
//       userName: formattedUserName,
//       email,
//       password: hashedPassword,
//     });
//     let response = await newUser.save();

//     // Send successful response
//     res.status(200).json({
//       success: true,
//       message: "User registered successfully.",
//       data: response,
//     });
//   } catch (error) {
//     // Handle database or server error
//     if (error.code === 11000) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email is already registered." });
//     }

//     console.error("Error during registration:", error.message);
//     res.status(500).json({ success: false, message: "Some error occurred." });
//   }
// };

// export const loginUser = async (req, res) => {
//   try {
//     // Validate request body using Joi
//     const { error, value } = loginValidator.validate(req.body);
//     if (error) {
//       return res.status(400).json({
//         success: false,
//         errors: error.details.map((detail) => ({
//           field: detail.path.join("."),
//           message: detail.message,
//         })),
//       });
//     }

//     const { email, password } = value;
//     const checkUser = await User.findOne({ email });

//     if (!checkUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User doesn't exist! Please register first.",
//       });
//     }

//     const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
//     if (!checkPasswordMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Incorrect password, please try again.",
//       });
//     }

//     // Generate Access Token (short-lived)
//     const accessToken = jwt.sign(
//       { id: checkUser.id, role: checkUser.role },
//       appConfig.userSecretKey,
//       { subject: "accessApi", expiresIn: appConfig.jwtExpirationTime } // Example: 15 minutes
//     );

//     // Generate Refresh Token (long-lived)
//     const refreshToken = jwt.sign(
//       { id: checkUser.id },
//       appConfig.userSecretKey,
//       { expiresIn: '7d' } // Example: 7 days
//     );

//     // Store Refresh Token in HttpOnly Cookie because its long-lived
//     res.cookie("refresh_token", refreshToken, {
//       httpOnly: true,
//       secure: appConfig.nodeEnv === "production", // Only secure in production
//       sameSite: "lax",
//       path: "/", // Root path for refresh token
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
//     });

//     // Send Access Token and User Data in Response
//     res.json({
//       success: true,
//       message: "Login successful.",
//       accessToken, // Send access token in response
//       user: {
//         id: checkUser.id,
//         role: checkUser.role, // Role for frontend routing
//       },
//     });
//   } catch (error) {
//     console.error("Error during login:", error.message);
//     res.status(500).json({ success: false, message: "Some error occurred." });
//   }
// };

// export const refreshAccessToken = async (req, res) => {
//   try {
//     const refreshToken = req.cookies?.refresh_token;

//     if (!refreshToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: No refresh token provided.",
//       });
//     }

//     // Verify the refresh token
//     const decodedToken = jwt.verify(refreshToken, appConfig.userSecretKey);

//     // Check if the user exists in the database
//     const user = await User.findById(decodedToken.id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // Generate a new access token
//     const newAccessToken = jwt.sign(
//       { id: user.id, role: user.role },
//       appConfig.userSecretKey,
//       { subject: "accessApi", expiresIn: appConfig.jwtExpirationTime }
//     );

//     // Return the new access token
//     return res.status(200).json({
//       success: true,
//       accessToken: newAccessToken,
//       //no need to pass the user 
//     });
//   } catch (error) {
//     console.error("Error refreshing token:", error.message);

//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         message: "Refresh token expired. Please log in again.",
//       });
//     }

//     return res.status(401).json({
//       success: false,
//       message: "Invalid refresh token.",
//     });
//   }
// };
// export const logoutUser = (req, res) => {
//   // Clear the cookie with the name 'token'
//   return res.clearCookie("token").json({
//     success: true,
//     message: "Logged out successfully",
//   });
// };

// // export const authMiddleware=async(req,res,next) => { //get method
// //   const token=req.cookies.token;
// //  // console.log(token);
// //   if(!token){
// //     return res.status(401).json({
// //       success:false,
// //       message:'Un-authorised User'
// //     })
// //   }
// //   try {
// //     const decodeToken= jwt.verify(token,appConfig.userSecretKey);
// //     //console.log(decodeToken)
// //     req.user=decodeToken;
// //     next();     //middlewarec call bhaisakeypachhi ko function
// //   } catch (error) {
// //      return res.status(401).json({success:false, message:'Un-authorised User'});
// //   }
// // }

// export const authMiddleware = async (req, res, next) => {
//   try {
//     // const token = req.cookies?.token;
//     const token = req.headers.authorization?.split(" ")[1];  // Get token from Authorization header
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: No token provided.",
//       });
//     }

//     // Verify and decode token
//     const decodedToken = jwt.verify(token, appConfig.userSecretKey);
//     // console.log("Token Expiration Time (exp):", decodedToken.exp);
//     // const duration = decodedToken.exp - decodedToken.iat;
//     //  console.log("Expiration duration:", duration); // Should be 20

//     // Check user existence in the database
//     const user = await User.findById(decodedToken.id); // Assuming `id` is in the token payload
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: User not found.",
//       });
//     }

//     // Check if the user is active (optional, based on app requirements)
//     /* if (!user.isActive) {
//           return res.status(403).json({
//               success: false,
//               message: 'Unauthorized: User is deactivated.',
//           });
//       } */

//     // Attach user data to the request object
//     req.user = user;

//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     console.error("Authentication Middleware Error:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized: Invalid or expired token.",
//     });
//   }
// };



// import bcrypt from "bcryptjs";
// import { User } from "../../models/model.js";
// import userValidator from "../../validators/userValidator.js";
// import jwt from 'jsonwebtoken';
// import appConfig from "../../appConfig.js";

// export const registerUser = async (req, res) => {
//   try {
//     // Validate request body using Joi
//     const { error, value } = userValidator.validate(req.body, {
//       abortEarly: false, // Report all errors
//       stripUnknown: true, // Remove unknown fields
//     });

//     if (error) {
//       return res.status(400).json({
//         success: false,
//         errors: error.details.map((detail) => ({
//           field: detail.path.join("."),
//           message: detail.message,
//         })),
//       });
//     }

//     const { userName, email, password } = value;

//     // Capitalize the first letter of the username after validation
//     const formattedUserName =
//       userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           message: "Email already exists.Please recheck your Email.",
//         });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create and save the new user with the properly formatted username
//     const newUser = new User({
//       userName: formattedUserName,
//       email,
//       password: hashedPassword,
//     });
//     let response = await newUser.save();

//     // Send successful response
//     res
//       .status(200)
//       .json({
//         success: true,
//         message: "User registered successfully.",
//         data: response,
//       });
//   } catch (error) {
//     // Handle database or server error
//     if (error.code === 11000) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email is already registered." });
//     }

//     console.error("Error during registration:", error.message);
//     res.status(500).json({ success: false, message: "Some error occurred." });
//   }
// };



// export const loginUser= async (req, res) => {
//   try {
//     // Validate request body using Joi

//     const { email, password } = req.body;
//     const checkUser = await User.findOne({ email });

//     // console.log(checkUser); //it contains password as weel for the email we are searching
//     if (!checkUser) {
//             return res.status(404).json({
//               success: false,
//               message: "User doesn't exist! Please register first",
//             });
//           }

//     const checkPasswordMatch = await bcrypt.compare(
//       password,
//       checkUser.password
//     ); //user typed password ,dbpassword if matched gives true
//     if (!checkPasswordMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Incorrect password, please try again",
//       });
//     }

//     const token = jwt.sign(
//       { id: checkUser.id, role: checkUser.role, email: checkUser.email },
//       appConfig.userSecretKey,
//       { expiresIn: appConfig.jwtExpirationTime }
//     );
//   //  console.log(token);
//     res.cookie("token", token, { httpOnly: true, secure: false }).json({    //secure: false should be true later
//       success: true,
//       message: "Login succesfull",
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



//  export const logoutUser = (req, res) => {
//   // Clear the cookie with the name 'token'
//  return res.clearCookie('token').json({
//     success: true,
//     message: "Logged out successfully"
//   });
// };

// // export const authMiddleware=async(req,res,next) => { //get method
// //   const token=req.cookies.token;
// //  // console.log(token);
// //   if(!token){
// //     return res.status(401).json({
// //       success:false,
// //       message:'Un-authorised User'
// //     })
// //   }
// //   try {
// //     const decodeToken= jwt.verify(token,appConfig.userSecretKey);
// //     //console.log(decodeToken)
// //     req.user=decodeToken;
// //     next();     //middlewarec call bhaisakeypachhi ko function
// //   } catch (error) {
// //      return res.status(401).json({success:false, message:'Un-authorised User'});
// //   }
// // } 

// export const authMiddleware = async (req, res, next) => {
//   try {
//       const token = req.cookies?.token;

//       if (!token) {
//           return res.status(401).json({
//               success: false,
//               message: 'Unauthorized: No token provided.',
//           });
//       }

//       // Verify and decode token
//       const decodedToken = jwt.verify(token, appConfig.userSecretKey);
     
//       // Check user existence in the database
//       const user = await User.findById(decodedToken.id); // Assuming `id` is in the token payload
//       if (!user) {
//           return res.status(401).json({
//               success: false,
//               message: 'Unauthorized: User not found.',
//           });
//       }

//       // Check if the user is active (optional, based on app requirements)
//       /* if (!user.isActive) {
//           return res.status(403).json({
//               success: false,
//               message: 'Unauthorized: User is deactivated.',
//           });
//       } */

//       // Attach user data to the request object
//       req.user = user;

//       next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//       console.error("Authentication Middleware Error:", error.message);
//       return res.status(401).json({
//           success: false,
//           message: 'Unauthorized: Invalid or expired token.',
//       });
//   }
// };