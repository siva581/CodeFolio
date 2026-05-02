import rateLimit from "express-rate-limit";


export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.ENABLE_RATE_LIMIT !== "true",
});


export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.ENABLE_RATE_LIMIT !== "true",
});


export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10, 
  message: "Too many contact messages, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.ENABLE_RATE_LIMIT !== "true",
});
