import type { CreateMetricSchema, Metric } from "@metrifacts/api/schema";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const queryKeys = {
  metrics: {
    all: () => ["metrics"] as const,
    list: () => ["metrics", "list"] as const,
    detail: (id: string) => ["metrics", "detail", id] as const,
  },
} as const;

export const getMetrics = async (): Promise<Metric[]> => {
  const response = await fetch(`${API_BASE_URL}/metrics`);

  if (!response.ok) {
    throw new Error("Failed to fetch metrics");
  }

  return response.json();
};

export const metricsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.metrics.list(),
    queryFn: getMetrics,
  });

export const createMetric = async (
  metric: CreateMetricSchema
): Promise<Metric> => {
  const response = await fetch(`${API_BASE_URL}/metrics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metric),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to create metric");
  }

  return response.json();
};

export function useCreateMetric({
  onSuccess,
}: {
  onSuccess?: (metric: Metric) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMetric,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.metrics.all(),
      });

      queryClient.setQueryData(queryKeys.metrics.detail(data.id), data);

      toast.success(`Metric "${data.name}" created successfully!`);
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create metric");
    },
  });
}
