import type { Metric } from "@metrifacts/api/schema";

import { MetricCard } from "@/components/metric-card";
import { cn } from "@/lib/utils";

type MetricListProps = {
  category: Metric["category"];
  metrics: Metric[];
};

export function MetricList({ category = "general", metrics }: MetricListProps) {
  return (
    <section className="space-y-6">
      <h2 className="border-border border-b pb-2 font-semibold text-xl capitalize">
        {category?.split("-").join(" ")}
      </h2>

      <ul
        className={cn(
          "grid grid-cols-1 items-stretch gap-10",
          metrics.length >= 2 && "lg:grid-cols-2"
        )}
      >
        {metrics.map((metric, index) => (
          <li
            key={metric.id}
            className={cn(
              metrics.length >= 3 && index === 0 && "lg:col-span-2"
            )}
          >
            <MetricCard {...metric} />
          </li>
        ))}
      </ul>
    </section>
  );
}
