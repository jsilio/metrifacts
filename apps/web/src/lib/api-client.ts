import { createClient } from "@metrifacts/api/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export const client = createClient(API_BASE_URL);
