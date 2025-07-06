import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { createErrorResponse } from "@/lib/errors";
import * as HttpStatusCodes from "@/lib/http-status-codes";

export const onError: ErrorHandler = (error, c) => {
  const requestId = c.get("requestId");
  const errorResponse = createErrorResponse(error, requestId);

  const currentStatus =
    "status" in error ? error.status : c.newResponse(null).status;

  const statusCode = (
    currentStatus !== HttpStatusCodes.OK
      ? currentStatus
      : HttpStatusCodes[
          errorResponse.error.code as keyof typeof HttpStatusCodes
        ]
  ) as ContentfulStatusCode;

  return c.json(
    {
      ...errorResponse,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    },
    statusCode
  );
};
