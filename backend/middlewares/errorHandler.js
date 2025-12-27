const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for developer
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

module.exports = errorHandler;

// ============================================================================
// Enhanced Error Handling and Logging 
// ============================================================================

const logError = (error, req) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  };
  
  console.error('=== ERROR LOGGED ===');
  console.error(JSON.stringify(errorLog, null, 2));
  
  return errorLog;
};

const formatErrorResponse = (error) => {
  return {
    success: false,
    message: error.message || 'Something went wrong',
    timestamp: new Date().toISOString()
  };
};

const handleError = (err, req, res, next) => {
  logError(err, req);
  const statusCode = err.statusCode || 500;
  const response = formatErrorResponse(err);
  res.status(statusCode).json(response);
};

module.exports = { logError, formatErrorResponse, handleError };