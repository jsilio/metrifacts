import { z } from "zod";

export const IdParamsSchema = z.object({
  id: z.string().cuid(),
});

export const MetricSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
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
  value: z.coerce.number().min(0, "Value must be greater than 0"),
  timestamp: z.string().datetime(),
});
export type MetricEntry = z.infer<typeof MetricEntrySchema>;

export const CreateMetricEntrySchema = MetricEntrySchema.omit({
  id: true,
});
export type CreateMetricEntrySchema = z.infer<typeof CreateMetricEntrySchema>;

export const UpdateMetricEntrySchema = MetricEntrySchema.partial();
export type UpdateMetricEntrySchema = z.infer<typeof UpdateMetricEntrySchema>;

export const MetricEntriesQuerySchema = z.object({
  limit: z.coerce.number().positive().max(1000).optional().default(100),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});
