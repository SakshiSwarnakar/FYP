import express from "express";

import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler, notFound } from "./middleware/errorHandlers.js";

import authRoutes from "./routes/auth.route.js";
import healthRoute from "./routes/health.route.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRoute);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
