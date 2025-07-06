import type { Metric } from "@metrifacts/api/schema";
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
