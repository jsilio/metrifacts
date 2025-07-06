import { randomUUID } from "node:crypto";
import z, { ZodError } from "zod";

import { Prisma } from "@/db";

import * as HttpStatusPhrases from "./http-status-phrases";

export const ErrorCode = z.enum([
  "BAD_REQUEST",
  "NOT_FOUND",
  "CONFLICT",
  "UNPROCESSABLE_ENTITY",
  "INTERNAL_SERVER_ERROR",
]);

export type ErrorCode = z.infer<typeof ErrorCode>;

export class MetrifactsApiError extends Error {
  readonly code: ErrorCode;
  readonly requestId: string;

  constructor({
    code,
    message = HttpStatusPhrases[code],
    requestId = randomUUID(),
  }: {
    code: ErrorCode;
    message?: string;
    requestId?: string;
  }) {
    super(message);
    this.code = code;
    this.requestId = requestId;
    this.name = "MetrifactsApiError";
  }
}

export function createErrorResponse(error: unknown, requestId?: string) {
  if (error instanceof MetrifactsApiError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        requestId: error.requestId,
      },
    };
  }

  if (error instanceof ZodError) {
    return {
      error: {
        code: "UNPROCESSABLE_ENTITY",
        message: formatZodError(error),
        requestId,
      },
    };
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return {
      error: {
        code: "NOT_FOUND",
        message: HttpStatusPhrases.NOT_FOUND,
        requestId,
      },
    };
  }

  return {
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
      requestId,
    },
  };
}

export function formatZodError(error: ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
}
