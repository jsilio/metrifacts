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
import { queryKeys as metricQueryKeys } from "./use-metrics";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const queryKeys = {
  entries: {
    all: (metricId: string) => ["metrics", metricId, "entries"] as const,
    list: (
      metricId: string,
      params?: {
        limit?: number;
        from?: string;
        to?: string;
        order?: "asc" | "desc";
      }
    ) =>
      [
        "metrics",
        metricId,
        "entries",
        "list",
        ...(params ? [params] : []),
      ] as const,
  },
} as const;

// API Functions
export const getMetricEntries = async (
  metricId: string,
  params?: {
    limit?: number;
    from?: string;
    to?: string;
    order?: "asc" | "desc";
  }
): Promise<MetricEntry[]> => {
  const searchParams = new URLSearchParams();

  if (params?.limit) {
    searchParams.set("limit", params.limit.toString());
  }
  if (params?.from) {
    searchParams.set("from", params.from);
  }
  if (params?.to) {
    searchParams.set("to", params.to);
  }
  if (params?.order) {
    searchParams.set("order", params.order);
  }

  const query = searchParams.toString();
  const response = await fetch(
    `${API_BASE_URL}/metrics/${metricId}/entries${query ? `?${query}` : ""}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch metric entries");
  }

  return response.json();
};

export const createMetricEntry = async (
  metricId: string,
  entry: CreateMetricEntrySchema
): Promise<MetricEntry> => {
  const response = await fetch(`${API_BASE_URL}/metrics/${metricId}/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to create metric entry");
  }

  return response.json();
};

export const metricEntriesQueryOptions = (
  metricId: string,
  params?: {
    limit?: number;
    from?: string;
    to?: string;
    order?: "asc" | "desc";
  }
) =>
  queryOptions({
    queryKey: queryKeys.entries.list(metricId, params),
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
    mutationFn: ({
      metricId,
      ...data
    }: CreateMetricEntrySchema & { metricId: string }) => {
      if (!metricId) {
        throw new Error("Metric ID is required");
      }
      return createMetricEntry(metricId, data);
    },
    onSuccess: (data, { metricId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all(metricId),
      });

      queryClient.invalidateQueries({
        queryKey: metricQueryKeys.metrics.detail(metricId),
      });

      toast.success("Metric entry added successfully!");
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add metric entry");
    },
  });
}
