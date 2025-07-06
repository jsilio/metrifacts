import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import appRouter from "@/routes";

const app = new Hono().basePath("/api");

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
  })
);

app.get("/", (c) => c.json({ status: "OK" }));
app.route("/", appRouter);

import { serve } from "@hono/node-server";

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
