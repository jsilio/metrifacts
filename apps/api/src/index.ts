import "dotenv/config";
import { serve } from "@hono/node-server";
import { handle } from "@hono/node-server/vercel";
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

if (process.env.NODE_ENV !== "production") {
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
}

export default handle(app);

export type AppType = typeof router;
