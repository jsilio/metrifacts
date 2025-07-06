"use client";

import type { Metric } from "@metrifacts/api/schema";
import { format } from "date-fns";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetricEntries } from "@/hooks/use-entries";

interface MetricChartProps {
  metric: Metric;
  className?: string;
}

export function MetricChart({ metric, className }: MetricChartProps) {
  const { data: entries, isLoading } = useMetricEntries(metric.id, {
    limit: 30,
    order: "asc",
  });

  const chartData = useMemo(() => {
    if (!entries) {
      return [];
    }

    return entries.map((entry) => ({
      date: format(new Date(entry.timestamp), "MM/dd"),
      value: entry.value,
      timestamp: entry.timestamp,
    }));
  }, [entries]);

  const chartConfig = {
    value: {
      label: metric.unit || "Value",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return <Skeleton className="h-[180px] w-full" />;
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="flex h-[180px] items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-sm">No data available</p>
          <p className="text-xs">Add entries to see the chart</p>
        </div>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className={className}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-value)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-value)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => `Date: ${value}`}
              formatter={(value) => [
                `${value} ${metric.unit || ""}`,
                metric.name,
              ]}
            />
          }
        />
        <Area
          dataKey="value"
          type="natural"
          fill="url(#fillValue)"
          stroke="var(--color-value)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
