"use client";

import type { Metric } from "@metrifacts/api/schema";
import { format, subDays } from "date-fns";
import { TrendingDownIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { AddEntryButton } from "@/components/add-entry-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
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
import { useBulkCreateEntries, useMetricEntries } from "@/hooks/use-entries";
import { generateSampleEntries } from "@/lib/utils";

export function MetricCard(metric: Metric) {
  const { data: entries, isLoading, error } = useMetricEntries(metric.id);

  const [period, setPeriod] = useState("30d");

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

  const chartConfig = {
    value: {
      label: metric.unit,
      color: "#4f46e5",
    },
  } satisfies ChartConfig;

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

        <div className="flex items-center gap-2">
          <AddEntryButton metric={metric} />

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
        </div>
      </CardHeader>

      <CardContent className="space-y-4 mt-6">
        {chartData.length === 0 ? (
          <EmptyState metric={metric} />
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
                  new Intl.NumberFormat("en", {
                    notation: "compact",
                    style: metric.unit === "$" ? "currency" : "decimal",
                    currency: "USD",
                  }).format(value) + (metric.unit === "%" ? "%" : "")
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

function EmptyState({ metric }: { metric: Metric }) {
  const bulkCreateMutation = useBulkCreateEntries();

  const handlePopulate = () => {
    const sampleEntries = generateSampleEntries(metric);
    bulkCreateMutation.mutate(sampleEntries);
  };

  return (
    <div className="flex h-56 space-y-5 flex-col items-center justify-center rounded-lg bg-slate-50 text-center">
      <div className="rounded-full bg-slate-200 p-3">
        <TrendingDownIcon className="size-6 text-slate-600 " />
      </div>

      <div>
        <h3 className="text-sm font-medium">No data available</h3>
        <p className="text-xs text-muted-foreground">
          Get started by adding your first entry
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handlePopulate}
          disabled={bulkCreateMutation.isPending}
        >
          {bulkCreateMutation.isPending
            ? "Adding..."
            : "Populate with sample data"}
        </Button>

        <AddEntryButton metric={metric} />
      </div>
    </div>
  );
}
