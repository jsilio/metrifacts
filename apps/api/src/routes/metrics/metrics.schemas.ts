import { z } from "zod";

export const IdParamsSchema = z.object({
  id: z.string().cuid(),
});

export const MetricSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Metric = z.infer<typeof MetricSchema>;

export const CreateMetricSchema = MetricSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateMetricSchema = z.infer<typeof CreateMetricSchema>;

export const UpdateMetricSchema = MetricSchema.partial();
export type UpdateMetricSchema = z.infer<typeof UpdateMetricSchema>;

export const MetricEntrySchema = z.object({
  id: z.string().cuid(),
  metricId: z.string().cuid(),
  value: z.number().min(0, "Value must be greater than 0"),
  timestamp: z.string().datetime(),
});
export type MetricEntry = z.infer<typeof MetricEntrySchema>;

export const CreateMetricEntrySchema = MetricEntrySchema.omit({
  id: true,
  metricId: true,
});
export type CreateMetricEntrySchema = z.infer<typeof CreateMetricEntrySchema>;

export const UpdateMetricEntrySchema = MetricEntrySchema.partial();
export type UpdateMetricEntrySchema = z.infer<typeof UpdateMetricEntrySchema>;

export const MetricEntriesQuerySchema = z
  .object({
    limit: z.string().transform(Number).optional().default("100"),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    order: z.enum(["asc", "desc"]).optional().default("asc"),
  })
  .refine(
    (data) => {
      if (data.from && data.to) {
        return new Date(data.from) < new Date(data.to);
      }

      return true;
    },
    { message: "from date must be before to date" }
  );
