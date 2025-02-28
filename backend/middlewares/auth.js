import jwt from 'jsonwebtoken';
import asyncHandler from "express-async-handler";
import User from '../models/User.js';

export const auth = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Auth middleware - Token:', token);
    if (!token) {
        res.status(401);
        throw new Error('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token - userId:', decoded.id);
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Auth middleware error - Full error:', error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401);
            throw new Error('Invalid token format: ' + error.message);
        } else if (error.name === 'TokenExpiredError') {
            res.status(401);
            throw new Error('Token expired: ' + error.message);
        } else {
            res.status(500);
            throw new Error('Authentication failed: ' + error.message);
        }
    }
});



export const checkRole = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.userId).select("+role");
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }
        if (!roles.includes(user.role)) {
            res.status(403);
            throw new Error("Permission denied!");
        }
        req.userRole = user.role; // Add user role to request for use in controllers
        next();
    });
};