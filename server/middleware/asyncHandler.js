/**
 * Utility to wrap async express routes to avoid repetitive try-catch blocks
 * and ensure errors are passed to the centralized error handler.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
