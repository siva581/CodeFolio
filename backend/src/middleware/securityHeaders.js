import helmet from "helmet";

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'",
        process.env.CLIENT_URL || "http://localhost:5173",
        "https://api.stripe.com",
      ],
      frameSrc: ["https://js.stripe.com"],
    },
  },
  frameguard: {
    action: "deny",
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },
});
