import { useMemo } from "react";

import type { Metric } from "@metrifacts/api/schema";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function MetricStats({
  entries,
  unit,
}: {
  entries: { date: string; value: number }[];
  unit: Metric["unit"];
}) {
  const stats = useMemo(() => {
    if (!entries?.length || entries.length === 1) return null;

    const values = entries.map((e) => e.value);
    const current = values[values.length - 1];
    const first = values[0];
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;

    const change = current - first;
    const changePercent = first ? (change / first) * 100 : 0;

    return {
      current,
      average,
      changePercent,
      isIncreasing: change > 0,
    };
  }, [entries]);

  if (!stats) return null;

  const formatValue = (value: number) => {
    const formatted = new Intl.NumberFormat("en", {
      style: unit === "$" ? "currency" : "decimal",
      currency: "USD",
      maximumFractionDigits: unit === "%" ? 2 : 0,
    }).format(value);

    if (unit === "%") return `${formatted}%`;
    if (unit && !["count", "$"].includes(unit)) return `${formatted} ${unit}`;
    return formatted;
  };
  return (
    <dl>
      <dt className="sr-only">Current value</dt>
      <dd className="text-2xl font-bold">{formatValue(stats.current)}</dd>

      <div className="flex items-center gap-4 text-sm">
        <div>
          <dt className="sr-only">Trend</dt>
          <dd
            className={cn(
              "flex items-center gap-1",
              stats.isIncreasing ? "text-green-600" : "text-destructive"
            )}
          >
            {stats.isIncreasing ? (
              <TrendingUpIcon className="size-4" />
            ) : (
              <TrendingDownIcon className="size-4" />
            )}
            <span>
              {stats.isIncreasing ? "+" : ""}
              {stats.changePercent.toFixed(1)}%
            </span>
          </dd>
        </div>

        <div>
          <dt className="sr-only">Average</dt>
          <dd className="text-muted-foreground">
            Avg. {formatValue(stats.average)}
          </dd>
        </div>
      </div>
    </dl>
  );
}
