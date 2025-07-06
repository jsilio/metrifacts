import { z } from "zod";

export const IdParamsSchema = z.object({
  id: z.string().cuid(),
});
export type IdParams = z.infer<typeof IdParamsSchema>;

export const MetricSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string().nullish(),
  category: z.string().nullish().default("general"),
  unit: z.string().nullish().default("count"),
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
  value: z.number(),
  timestamp: z.string().datetime(),
});
export type MetricEntry = z.infer<typeof MetricEntrySchema>;

export const CreateMetricEntrySchema = MetricEntrySchema.omit({
  id: true,
  timestamp: true,
});
export type CreateMetricEntrySchema = z.infer<typeof CreateMetricEntrySchema>;

export const UpdateMetricEntrySchema = MetricEntrySchema.partial();
export type UpdateMetricEntrySchema = z.infer<typeof UpdateMetricEntrySchema>;
