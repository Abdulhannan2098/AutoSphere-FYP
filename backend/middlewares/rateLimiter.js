const rateLimit = require('express-rate-limit');

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again after 1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email verification limiter
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 email requests per hour
  message: {
    success: false,
    message: 'Too many email requests, please try again after 1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Order creation limiter
const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 orders per minute
  message: {
    success: false,
    message: 'Too many orders created, please slow down',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  emailLimiter,
  orderLimiter,
};

// ============================================================================
// Response Time Optimization - Jan 2, 2026
// ============================================================================

// Middleware to log response times
const responseTimeLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    if (duration > 1000) {
      console.warn(`Slow API: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  
  next();
};

// Cache middleware for GET requests
const cacheMiddleware = (duration = 300) => {
  const cache = new Map();
  
  return (req, res, next) => {
    if (req.method !== 'GET') return next();
    
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < duration * 1000) {
      return res.json(cached.data);
    }
    
    res.originalJson = res.json;
    res.json = (data) => {
      cache.set(key, { data, timestamp: Date.now() });
      res.originalJson(data);
    };
    
    next();
  };
};

module.exports = {
  responseTimeLogger,
  cacheMiddleware
};