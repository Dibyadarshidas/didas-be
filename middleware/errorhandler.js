const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(`${err.name}: ${err.message}`, { 
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip
  });

  // Send response
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Server error, please try again later' 
      : err.message
  });
};

module.exports = errorHandler;