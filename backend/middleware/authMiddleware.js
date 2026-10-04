const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protectUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vyntra_super_secret_jwt_key_2026_prod');
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User token invalid or user not found' });
      }
      if (user.status === 'blocked') {
        return res.status(403).json({ message: 'Account has been blocked by administrator' });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vyntra_super_secret_jwt_key_2026_prod');
      
      if (decoded.role === 'admin' || decoded.role === 'superadmin') {
        const admin = await Admin.findById(decoded.id).select('-password');
        if (admin) {
          req.admin = admin;
          return next();
        }
        // Fallback: check if standard user has admin role
        const user = await User.findById(decoded.id).select('-password');
        if (user && user.role === 'admin') {
          req.admin = user;
          return next();
        }
      }
      return res.status(403).json({ message: 'Access denied: Admin authorization required' });
    } catch (error) {
      return res.status(401).json({ message: 'Admin session expired or token invalid' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized as admin, no token provided' });
  }
};

module.exports = { protectUser, protectAdmin };
