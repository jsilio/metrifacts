import type { Metric } from "@metrifacts/api/schema";

export function MetricCard(metric: Metric) {
  return (
    <div className="h-full w-full rounded-lg border p-4 ">
      <h3 className="font-medium text-lg">{metric.name}</h3>
      <p className="text-muted-foreground text-sm">{metric.description}</p>
    </div>
  );
}
