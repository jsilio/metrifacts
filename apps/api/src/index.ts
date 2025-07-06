import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";

import { cors } from "@/middlewares/cors";
import { onError } from "@/middlewares/on-error";
import metricsRouter from "@/routes/metrics";

const app = new Hono().basePath("/api");

app.use("/*", cors());
app.use(requestId());
app.use(logger());

app.onError(onError);

app.get("/", (c) => c.json({ message: "Metrifacts API", status: "ok" }));
app.route("/", metricsRouter);

showRoutes(app);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
