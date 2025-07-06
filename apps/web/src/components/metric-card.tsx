"use client";

import type { Metric } from "@metrifacts/api/schema";
import { PencilIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useMemo } from "react";

import { MetricChart } from "@/components/metric-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMetricEntries } from "@/hooks/use-entries";
import { cn } from "@/lib/utils";

export function MetricCard(metric: Metric) {
  const { data: entries } = useMetricEntries(metric.id);

  const trend = useMemo(() => {
    if (!entries || entries.length < 2) {
      return null;
    }

    const first = entries[0].value;
    const last = entries.at(-1)?.value;
    const change = last ? last - first : 0;
    const percentage = (change / first) * 100;

    return {
      change,
      percentage,
      isPositive: change >= 0,
    };
  }, [entries]);

  const latestValue = entries?.[entries.length - 1]?.value;

  return (
    <Card className="group relative h-full w-full transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="font-medium text-base">
                {metric.name}
              </CardTitle>
            </div>

            {metric.description && (
              <CardDescription className="text-sm">
                {metric.description}
              </CardDescription>
            )}

            <div className="flex items-center gap-3 pt-1">
              {latestValue !== undefined && (
                <span className="font-semibold text-lg">
                  {latestValue.toLocaleString()} {metric.unit}
                </span>
              )}

              {trend && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? (
                    <TrendingUpIcon className="size-3" />
                  ) : (
                    <TrendingDownIcon className="size-3" />
                  )}
                  <span>
                    {trend.isPositive ? "+" : ""}
                    {trend.percentage.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <PencilIcon />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <MetricChart metric={metric} className="h-[180px] w-full" />
      </CardContent>
    </Card>
  );
}
