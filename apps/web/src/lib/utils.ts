import type { CreateMetricEntrySchema, Metric } from "@metrifacts/api/schema";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupMetricsByCategory(metrics: Metric[]) {
  const grouped = metrics.reduce((categories, metric) => {
    const category = metric.category || "general";

    if (!categories[category]) {
      categories[category] = [];
    }

    categories[category].push(metric);
    return categories;
  }, {} as Record<string, Metric[]>);

  return Object.keys(grouped)
    .sort()
    .map((category) => ({
      category,
      metrics: grouped[category],
    }));
}

export function generateSampleEntries(metric: Metric) {
  const entries: CreateMetricEntrySchema[] = [];
  const now = new Date();

  const baseValue = metric.unit === "$" ? 10_000 : 60;
  const trend = Math.random() > 0.5 ? 1.02 : 0.98;

  for (let day = 30; day >= 1; day--) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);
    date.setHours(12, 0, 0, 0);

    const dailyTrend = trend ** day;
    const randomness = 0.85 + Math.random() * 0.3;
    const value = baseValue * dailyTrend * randomness;

    entries.push({
      metricId: metric.id,
      value: Math.round(value * 100) / 100,
      timestamp: date.toISOString(),
    });
  }

  return entries;
}
