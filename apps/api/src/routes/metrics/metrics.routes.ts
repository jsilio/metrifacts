import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { prisma } from "@/db";

import { CreateMetricSchema } from "./metrics.schemas";

const router = new Hono();

router.get("/", async (c) => {
  const metrics = await prisma.metric.findMany({
    orderBy: { createdAt: "desc" },
  });

  return c.json({ success: true, data: metrics });
});

router.post("/", zValidator("json", CreateMetricSchema), async (c) => {
  const data = c.req.valid("json");
  const metric = await prisma.metric.create({ data });

  return c.json({ success: true, data: metric }, 201);
});

export default router;
