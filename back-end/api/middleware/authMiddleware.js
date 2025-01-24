import jwt from 'jsonwebtoken';
import appConfig from '../appConfig.js';
import { User } from '../models/model.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided.",
        isExpired: true
      });
    }

    const decodedToken = jwt.verify(accessToken, appConfig.userSecretKey);
    const user = await User.findById(decodedToken.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        isExpired: true
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid access token"
    });
  }
};