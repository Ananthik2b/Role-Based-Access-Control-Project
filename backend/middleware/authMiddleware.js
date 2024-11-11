// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

// Middleware to authenticate token and fetch permissions
const authenticateToken =  (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the token
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        console.log('Decoded token:', decoded); 
        req.user = decoded; // Set user details from decoded token (user ID and role ID)
        next();
    } catch (error) {
        console.error('Token verification or database fetch failed:', error.message); // Log error
        return res.status(403).json({ message: 'Failed to authenticate token' });
    }
};

// Middleware to authorize based on permissions
const authorize = (requiredPermissions) => {
    return (req, res, next) => {
        const userPermissions = req.user.permissions || []; // Check permissions

        // Check if the user has all required permissions
        const hasPermission = requiredPermissions.every((perm) => userPermissions.includes(perm));
        
        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorize };
