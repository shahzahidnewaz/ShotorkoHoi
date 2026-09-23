import express from "express";
import cors from "cors";
import metaRouter from "./routes/meta.js";
import facilitiesRouter from "./routes/facilities.js";
import reportsRouter from "./routes/reports.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import statsRouter from "./routes/stats.js";

export const app = express();
app.set("trust proxy", 1);
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "600kb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/meta", metaRouter);
app.use("/api/facilities", facilitiesRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stats", statsRouter);
app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});
