const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Session = require('../models/Session');
const { JWT_SECRET } = require('../config/env');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if session exists and is active
    const session = await Session.findOne({
      token,
      isActive: true,
      expiresAt: { $gt: Date.now() },
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Session expired or invalid. Please login again.',
      });
    }

    // Check for inactivity timeout
    if (session.isInactive()) {
      await session.revoke();
      return res.status(401).json({
        success: false,
        message: 'Session expired due to inactivity. Please login again.',
        code: 'SESSION_TIMEOUT',
      });
    }

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated',
      });
    }

    // Attach token to request for session management
    req.token = token;
    req.session = session;

    // Update session activity (non-blocking)
    session.updateActivity().catch(err => console.error('Failed to update session activity:', err));

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token',
    });
  }
};

module.exports = { protect };

// ============================================================================
// Final Security Enhancements - Jan 3, 2026
// ============================================================================

// Sanitize user input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')
    .trim();
};

// Check for suspicious patterns
const detectSuspiciousActivity = (req) => {
  const suspiciousPatterns = [
    /<script>/i,
    /javascript:/i,
    /on\w+=/i,
    /\.\.\//,
    /union.*select/i
  ];
  
  const checkString = JSON.stringify(req.body) + req.url;
  
  return suspiciousPatterns.some(pattern => pattern.test(checkString));
};

// Enhanced auth check with security logging
const secureAuthCheck = async (req, res, next) => {
  try {
    // Check for suspicious activity
    if (detectSuspiciousActivity(req)) {
      console.warn('Suspicious activity detected:', {
        ip: req.ip,
        url: req.url,
        timestamp: new Date()
      });
      return res.status(403).json({
        success: false,
        message: 'Forbidden request'
      });
    }
    
    // Sanitize all body inputs
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeInput(req.body[key]);
        }
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { secureAuthCheck, sanitizeInput };