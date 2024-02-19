import jwt from 'jsonwebtoken';
import 'dotenv/config'
import {User} from '../models/userModel.js';


export const authenticateUser = async (req, res, next) => {
  try {
    // Extract token from headers, cookies, or request body
    const token = req.headers.authorization;

    if (!token) {
      throw new Error('No token, authorization denied');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database using decoded token data
    req.user = await User.findById(decoded.userId);


    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};





export const checkUserRole = (roles) => {
  return (req, res, next) => {
    // Assuming the user object is attached to the request after authentication
    const userRole = req.user.role;

    if (roles.includes(userRole)) {
      // User has the required role, allow them to proceed
      next();
    } else {
      // User does not have the required role, deny access
      res.status(403).json({ message: 'Unauthorized' });
    }
  };
};


