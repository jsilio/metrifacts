import { Hono } from "hono";

import metrics from "./metrics/metrics.routes";

const appRouter = new Hono();
appRouter.route("/metrics", metrics);

export default appRouter;
