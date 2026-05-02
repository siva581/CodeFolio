import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const clientOriginRaw = process.env.CLIENT_URL || "http://localhost:5173";
const clientOrigins = clientOriginRaw
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => (origin.startsWith("http") ? origin : `https://${origin}`));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser/tool requests and configured origins.
      if (!origin || clientOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payment", paymentRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`\n❌ Port ${port} is already in use.`);
        console.error(`   Run: netstat -ano | findstr :${port}  (Windows)`);
        console.error(`   Then: taskkill /PID <PID> /F\n`);
      } else {
        console.error("Server error:", err.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

startServer();
