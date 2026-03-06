import "dotenv/config";
import express, { Application } from "express";
import cors from "cors";

// Configurations & Routes
import { corsOptions } from "./config/cors.config.js";
import { responseTime } from "./middleware/response.time.js";
import apiRouter from "./routes/index.js"; // The "Master" router

const app: Application = express();
const PORT = process.env.PORT || 3000;

// 1. Global Middleware
app.use(cors(corsOptions));
app.use(responseTime);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Health Check (Keep it simple)
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

// 3. API Routes (Versioned)
app.use("/v1/api", apiRouter);

// 4. Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
