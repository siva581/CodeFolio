import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "JWT_SECRET is not set" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
