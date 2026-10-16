import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return next(new ApiError(400, 'Validation failed', formattedErrors));
    }
    next(new ApiError(400, error.message || 'Invalid request data'));
  }
};
