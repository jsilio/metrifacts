import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";

import { onError } from "@/middlewares/on-error";
import appRouter from "@/routes";

const app = new Hono().basePath("/api");

app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(logger());
app.use(requestId());

app.onError(onError);

app.get("/", (c) => c.json({ message: "Metrifacts API", status: "ok" }));
app.route("/", appRouter);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
