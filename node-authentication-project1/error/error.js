const commonError = require('./errorHandler');
function errorHandler(err, req, res, next) {
  res.setHeader('Content-Type', 'application/json');
    if (err instanceof commonError) {
        // Handle custom error
        res.status(400).json({
            error: err.name,
            message: err.message
        });
    } else {
        // Handle generic error
        res.status(500).json({
            error: 'InternalServerError',
            message: 'Something went wrong!'
        });
    }
}

module.exports = errorHandler;
