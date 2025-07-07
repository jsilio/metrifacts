import { zValidator } from "@hono/zod-validator";
import { prisma as db } from "@metrifacts/api/db";
import { Hono } from "hono";

import * as HttpStatusCodes from "../../lib/http-status-codes";

import {
  CreateMetricEntrySchema,
  CreateMetricSchema,
  IdParamsSchema,
  MetricEntriesQuerySchema,
} from "./metrics.schemas";

export const metricsRoutes = new Hono()
  .get("/", async (c) => {
    const metrics = await db.metric.findMany({
      orderBy: { createdAt: "desc" },
    });
    return c.json(metrics, HttpStatusCodes.OK);
  })

  .post("/", zValidator("json", CreateMetricSchema), async (c) => {
    const data = c.req.valid("json");
    const metric = await db.metric.create({ data });
    return c.json(metric, HttpStatusCodes.CREATED);
  })

  .get(
    "/:id/entries",
    zValidator("param", IdParamsSchema),
    zValidator("query", MetricEntriesQuerySchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { limit, order = "asc" } = c.req.valid("query");
      const entries = await db.metricEntry.findMany({
        where: { metricId: id },
        orderBy: { timestamp: order },
        take: limit,
      });
      return c.json(entries, HttpStatusCodes.OK);
    }
  )

  .post(
    "/:id/entries",
    zValidator("param", IdParamsSchema),
    zValidator("json", CreateMetricEntrySchema),
    async (c) => {
      const { id: metricId } = c.req.valid("param");
      const data = c.req.valid("json");
      const entry = await db.metricEntry.create({
        data: { ...data, metricId },
      });
      return c.json(entry, HttpStatusCodes.CREATED);
    }
  );
