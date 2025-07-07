import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";

import { cors } from "./middlewares/cors";
import { onError } from "./middlewares/on-error";
import { metricsRoutes } from "./routes/metrics/metrics.routes";

export const config = {
  api: {
    bodyParser: false,
  },
};

const app = new Hono().basePath("/api");

app.use("/*", cors());
app.use(requestId());
app.use(logger());
app.onError(onError);

app.get("/", (c) => c.json({ message: "Metrifacts API", status: "ok" }));

const router = app.route("/metrics", metricsRoutes);

showRoutes(app);

const port = Number(process.env.PORT) || 3000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

export type AppType = typeof router;
