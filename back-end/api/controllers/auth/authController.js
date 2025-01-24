import bcrypt from "bcryptjs";
import { User } from "../../models/model.js";
import userValidator from "../../validators/userValidator.js";
import jwt from "jsonwebtoken";
import appConfig from "../../appConfig.js";
import loginValidator from "../../validators/loginValidator.js";
// Add these helper functions at the top after imports
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    appConfig.userSecretKey,
    { 
      subject: "accessApi", 
      expiresIn: parseInt(appConfig.jwtExpirationTime, 10)
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    appConfig.refreshTokenSecretKey,
    { 
      subject: "refresh",
      expiresIn: parseInt(appConfig.refreshTokenExpirationTime, 10)
    }
  );
};
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
      return res.status(400).json({
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
    res.status(200).json({
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

export const loginUser = async (req, res) => {
  try {
    const { error, value } = loginValidator.validate(req.body, {
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
    const checkUser = await User.findOne({ email }).select("+password");
    console.log("Check User:", checkUser); // Log the entire user object

    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "User  doesn't exist! Please register first",
      });
    }

    // Now checkUser .password should be defined
    // console.log("Check User Password:", checkUser .password); // Log the password

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password, please try again",
      });
    }
    
    const accessToken = generateAccessToken(checkUser);
    const refreshToken = generateRefreshToken(checkUser);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: appConfig.nodeEnv === "production",
        sameSite: "lax",
        maxAge: parseInt(appConfig.jwtExpirationTime, 10) * 1000,
        path: "/",
        domain: appConfig.cookieDomain || undefined,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: appConfig.nodeEnv === "production",
        sameSite: "lax",
        maxAge: parseInt(appConfig.refreshTokenExpirationTime, 10) * 1000,
        path: "/",
        domain: appConfig.cookieDomain || undefined,
      })
      .json({
        success: true,
        message: "Login successful",
        user: {
          email: checkUser.email, // Added email
          role: checkUser.role,
          id: checkUser.id,
        },
      });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Some error occurred." });
  }
};

// export const refreshAccessToken = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const user = await User.findById(userId).select("-password");
    
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     const accessToken = generateAccessToken(user);

//     res
//       .cookie("accessToken", accessToken, {
//         httpOnly: true,
//         secure: appConfig.nodeEnv === "production",
//         sameSite: "lax",
//         maxAge: parseInt(appConfig.jwtExpirationTime, 10) * 1000,
//         path: "/",
//         domain: appConfig.cookieDomain,
//       })
//       .json({
//         success: true,
//         user: {
//           email: user.email,
//           role: user.role,
//           id: user.id
//         }
//       });
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error refreshing access token"
//     });
//   }
// };


export const refreshAccessToken = async (req, res) => {
  try {
    const userId = req.userId; // From middleware
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const accessToken = generateAccessToken(user);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: appConfig.nodeEnv === "production",
        sameSite: "lax",
        maxAge: parseInt(appConfig.jwtExpirationTime, 10) * 1000,
        path: "/",
        domain: appConfig.cookieDomain || undefined,
      })
      .json({
        success: true,
        user: {
          email: user.email,
          role: user.role,
          id: user.id
        }
      });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({
      success: false,
      message: "Error refreshing access token"
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie('accessToken', {
        path: "/",
        domain: appConfig.cookieDomain,
      })
      .clearCookie('refreshToken', {
        path: "/",
        domain: appConfig.cookieDomain,
      })
      .json({
        success: true,
        message: "Logged out successfully"
      });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error during logout"
    });
  }
};