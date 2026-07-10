// Wraps async route handlers so any thrown error is forwarded to
// the centralized errorHandler middleware instead of crashing the app.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
