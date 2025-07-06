import { useQuery } from "@tanstack/react-query";
import { BarChart3Icon } from "lucide-react";

import { AddMetricButton } from "@/components/metric-form";
import { MetricList } from "@/components/metric-list";
import { Skeleton } from "@/components/ui/skeleton";
import { metricsQueryOptions } from "@/hooks/use-metrics";
import { groupMetricsByCategory } from "@/lib/utils";

export function Dashboard() {
  const { data: metrics, isLoading, error } = useQuery(metricsQueryOptions);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <h2 className="font-semibold text-destructive text-xl">
        Failed to load metrics: {error.message}
      </h2>
    );
  }

  if (!metrics || metrics.length === 0) {
    return <EmptyState />;
  }

  const categories = groupMetricsByCategory(metrics);

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <MetricList key={category.category} {...category} />
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-8">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-32" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-indigo-50 to-indigo-50/10 py-12 text-center">
      <div className="mb-4 rounded-full bg-indigo-100 p-4">
        <BarChart3Icon className="size-10 text-indigo-600" />
      </div>
      <h2 className="mb-2 font-semibold text-xl">No metrics yet</h2>
      <p className="mb-6 max-w-xl text-balance text-muted-foreground">
        Get started by creating your first metric to track your key performance
        indicators.
      </p>
      <AddMetricButton />
    </div>
  );
}
