"use client";

import type { Metric } from "@metrifacts/api/schema";
import { format, subDays } from "date-fns";
import { TrendingDownIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetricEntries } from "@/hooks/use-entries";

export function MetricCard(metric: Metric) {
  const [period, setPeriod] = useState("7d");

  const { data: entries, isLoading, error } = useMetricEntries(metric.id);

  const chartConfig = {
    value: {
      label: metric.unit,
      color: "#4f46e5",
    },
  } satisfies ChartConfig;

  const chartData = useMemo(() => {
    if (!entries?.length) {
      return [];
    }

    const periodMap: Record<string, number> = {
      "24h": 1,
      "7d": 7,
      "30d": 30,
    };

    const cutoffDate = subDays(new Date(), periodMap[period] || 7);

    return entries
      .filter((entry) => new Date(entry.timestamp) >= cutoffDate)
      .map((entry) => ({
        date: entry.timestamp,
        value: entry.value,
      }));
  }, [entries, period]);

  if (isLoading) {
    return <MetricCardSkeleton />;
  }

  if (error) {
    return (
      <h2 className="font-semibold text-destructive text-xl">
        Failed to load metrics: {error.message}
      </h2>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle className="text-base font-medium">{metric.name}</CardTitle>
          {metric.description && (
            <CardDescription className="text-sm">
              {metric.description}
            </CardDescription>
          )}
        </div>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="space-y-4 mt-6">
        {chartData.length === 0 ? (
          <MetricCardEmptyState />
        ) : (
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) =>
                  period === "24h"
                    ? format(new Date(value), "HH:mm a")
                    : format(new Date(value), "MMM d")
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
                tickFormatter={(value) =>
                  metric.unit?.length && metric.unit.length < 3
                    ? `${value.toLocaleString()}${metric.unit}`
                    : value.toLocaleString()
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      period === "24h"
                        ? format(new Date(value), "HH:mm a")
                        : format(new Date(value), "MMM d, yyyy")
                    }
                  />
                }
              />
              <Line
                dataKey="value"
                type="natural"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function MetricCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-36" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
      å
    </Card>
  );
}

function MetricCardEmptyState() {
  return (
    <div className="flex h-[200px] flex-col items-center justify-center rounded-lg bg-slate-50 text-center">
      <div className="mb-4 rounded-full bg-slate-200 p-3">
        <TrendingDownIcon className="size-6 text-slate-600 " />
      </div>

      <h3 className="text-sm font-medium">No data available</h3>
      <p className="text-xs text-muted-foreground">
        Try selecting a different time period
      </p>
    </div>
  );
}
