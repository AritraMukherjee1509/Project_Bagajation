const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Admin = require('../models/Admin');

// Protect routes - general authentication
const protect = async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Protect admin routes
const protectAdmin = async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies
  if (!token && req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Admin authentication required.'
    });
  }

  try {
    // Verify token with admin secret
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET);

    // Check if admin still exists
    const admin = await Admin.findById(decoded.id).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin no longer exists'
      });
    }

    // Check if admin account is active
    if (admin.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Admin account is not active'
      });
    }

    // Check if account is locked
    if (admin.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Admin account is temporarily locked'
      });
    }

    // Update last active time
    admin.lastActiveAt = new Date();
    admin.activity.lastLogin = new Date();
    admin.activity.lastLoginIP = req.ip;
    await admin.save({ validateBeforeSave: false });

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid admin token.'
    });
  }
};

// Protect provider routes
const protectProvider = async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Provider authentication required.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if provider still exists
    const provider = await Provider.findById(decoded.id).select('+password');
    
    if (!provider) {
      return res.status(401).json({
        success: false,
        message: 'Provider no longer exists'
      });
    }

    // Check if provider is verified and active
    if (provider.verification.status !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Provider account is not verified'
      });
    }

    if (provider.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Provider account is not active'
      });
    }

    // Update last active time
    provider.lastActive = new Date();
    await provider.save({ validateBeforeSave: false });

    req.provider = provider;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid provider token.'
    });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user && user.status === 'active') {
        req.user = user;
      }
    } catch (error) {
      // Continue without authentication if token is invalid
    }
  }

  next();
};

module.exports = {
  protect,
  protectAdmin,
  protectProvider,
  optionalAuth
};