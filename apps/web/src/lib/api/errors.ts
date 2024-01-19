// 3rd party
import { z, ZodError } from 'zod';

/**
 * InvalidPayloadError
 *
 * The response payload isn't valid JSON.
 */

export class InvalidPayloadError extends Error {
  response: unknown;

  constructor(message: string, { response }: { response: unknown }) {
    super(message);
    this.response = response;
  }
}

/**
 * UnexpectedPayloadError
 *
 * The response payload didn't match the provided schema.
 */

export class UnexpectedPayloadError extends Error {
  response: unknown;
  error?: ZodError;

  constructor(
    message: string,
    { response, error }: { response: unknown; error?: ZodError },
  ) {
    super(message);
    this.response = response;
    this.error = error;
  }
}

/**
 * UnknownError
 */

export class UnknownError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * ServerError
 */

export const serverErrorsSchema = z.object({
  errors: z.array(
    z.object({
      code: z.number(),
      status: z.string(),
      title: z.string(),
      detail: z.string(),
      meta: z.any(),
    }),
  ),
});

type ServerErrors = z.infer<typeof serverErrorsSchema>;

export class ServerError extends Error {
  response: ServerErrors;

  constructor(message: string, response: ServerErrors) {
    super(message);
    this.response = response;
  }
}
