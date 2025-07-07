import type { CreateMetricSchema } from "@metrifacts/api/schema";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/api-client";

export const queryKeys = {
  metrics: () => ["metrics"] as const,
  detail: (id: string) => ["metrics", id] as const,
} as const;

export const getMetrics = async () => {
  const response = await client.api.metrics.$get();
  return response.json();
};

export const metricsQueryOptions = queryOptions({
  queryKey: queryKeys.metrics(),
  queryFn: getMetrics,
});

export function useCreateMetric({
  onSuccess,
}: {
  onSuccess?: (metricId: string) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metric: CreateMetricSchema) => {
      const response = await client.api.metrics.$post({ json: metric });
      return response.json();
    },
    onSuccess: (metric) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.metrics(),
      });

      toast.success(`Metric ${metric.name} created successfully!`);
      onSuccess?.(metric.id);
    },
    onError: (error) => toast.error(error.message || "Failed to create metric"),
  });
}
