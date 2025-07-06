import { cors as corsMiddleware } from "hono/cors";

export const cors = () =>
  corsMiddleware({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE", "PATCH"],
    allowHeaders: [
      "Accept",
      "Cache-Control",
      "Content-Type",
      "Origin",
      "X-Requested-With",
    ],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 600,
  });
