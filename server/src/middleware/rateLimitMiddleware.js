import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in a few minutes.',
  },
});

export const scriptGenLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // limit generation requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Script generation limit reached. Please wait a few moments before generating again.',
  },
});
