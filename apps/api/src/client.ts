import { hc } from "hono/client";
import type { AppType } from ".";

const apiClient = hc<AppType>("");
export type Client = typeof apiClient;

export const createClient = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);
