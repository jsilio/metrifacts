import { Hono } from "hono";

import metricsRouter from "./metrics.routes";

const router = new Hono();
router.route("/metrics", metricsRouter);

export default router;
