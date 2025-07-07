import type {
  CreateMetricEntrySchema,
  MetricEntry,
} from "@metrifacts/api/schema";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/api-client";

export const queryKeys = {
  entries: (metricId: string) => ["entries", metricId] as const,
} as const;

export const getMetricEntries = async (
  metricId: string,
  params?: { limit?: string; order?: "asc" | "desc" }
) => {
  const response = await client.api.metrics[":id"].entries.$get({
    param: { id: metricId },
    query: {
      ...(params || {}),
    },
  });

  return response.json();
};

export const metricEntriesQueryOptions = (
  metricId: string,
  params?: { limit?: string; order?: "asc" | "desc" }
) =>
  queryOptions({
    queryKey: queryKeys.entries(metricId),
    queryFn: () => getMetricEntries(metricId, params),
    enabled: !!metricId,
  });

export function useCreateMetricEntry({
  onSuccess,
}: {
  onSuccess?: (entry: MetricEntry) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: CreateMetricEntrySchema) => {
      const response = await client.api.metrics[":id"].entries.$post({
        param: { id: entry.metricId },
        json: entry,
      });

      return response.json();
    },
    onSuccess: (entry, { metricId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries(metricId),
      });

      toast.success("Entry added successfully!");
      onSuccess?.(entry);
    },
    onError: (error) => toast.error(error.message || "Failed to add entry"),
  });
}

export function useBulkCreateEntries({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entries: CreateMetricEntrySchema[]) => {
      const promises = entries.map((entry) =>
        client.api.metrics[":id"].entries
          .$post({
            param: { id: entry.metricId },
            json: entry,
          })
          .then((res) => res.json())
      );
      return Promise.all(promises);
    },
    onSuccess: (_, entries) => {
      const metricId = entries.at(0)?.metricId;

      if (metricId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.entries(metricId),
        });
      }

      toast.success("Sample data added successfully!");
      onSuccess?.();
    },
    onError: (error) =>
      toast.error(error.message || "Failed to add sample data"),
  });
}
