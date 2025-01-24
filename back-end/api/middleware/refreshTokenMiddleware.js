import jwt from 'jsonwebtoken';
import appConfig from '../appConfig.js';

export const verifyRefreshToken = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided"
      });
    }

    const decoded = jwt.verify(refreshToken, appConfig.refreshTokenSecretKey);
    
    if (!decoded.id) {
      throw new Error('Invalid token payload');
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    res.clearCookie('refreshToken', {
      path: "/",
      domain: appConfig.cookieDomain,
    });
    res.clearCookie('accessToken', {
      path: "/",
      domain: appConfig.cookieDomain,
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid refresh token"
    });
  }
};