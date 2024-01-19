// 3rd party
import { z } from 'zod';

// local
import {
  InvalidPayloadError,
  UnexpectedPayloadError,
  ServerError,
  serverErrorsSchema,
  UnknownError,
} from './errors';

/**
 * Result
 */

type Result<T, E> = { ok: true; val: T } | { ok: false; val: E };

/**
 * ExecuteRequestResult
 */

export type ExecuteRequestResult<T> = Promise<
  Result<
    T,
    | { name: 'InvalidPayloadError'; error: InvalidPayloadError }
    | { name: 'UnexpectedPayloadError'; error: UnexpectedPayloadError }
    | { name: 'ServerError'; error: ServerError }
    | { name: 'UnknownError'; error: UnknownError }
  >
>;

/**
 * executeRequest
 */

export async function executeRequest<
  Output extends object,
  Input extends object,
>({
  request,
  schema,
}: {
  request: Promise<Response>;
  schema: z.ZodType<Output, z.ZodTypeDef, Input>;
}): ExecuteRequestResult<Output> {
  const response = await request;

  // "No Content" - there's no response to parse so return immediately.
  if (response.status === 204) {
    return { ok: true, val: {} as Output };
  }

  const payload = await response.json().catch(() => null);

  if (payload === null) {
    return {
      ok: false,
      val: {
        name: 'InvalidPayloadError',
        error: new InvalidPayloadError(
          `${response.status}: ${response.statusText} - Invalid JSON`,
          {
            response: await response.text().catch(() => null),
          },
        ),
      },
    };
  }

  if (response.status / 100 === 2) {
    const result = schema.safeParse(payload);

    if (result.success === true) {
      return { ok: true, val: result.data };
    } else {
      console.error('UnexpectedPayloadError', { payload }); // eslint-disable-line no-console
      console.error('UnexpectedPayloadError', result.error.message); // eslint-disable-line no-console

      return {
        ok: false,
        val: {
          name: 'UnexpectedPayloadError',
          error: new UnexpectedPayloadError(
            'Server returned an unexpected payload.',
            {
              response: payload,
              error: result.error,
            },
          ),
        },
      };
    }
  } else {
    // TODO: This schema probably isn't correct.
    const result = serverErrorsSchema.safeParse(payload);

    if (result.success) {
      return {
        ok: false,
        val: {
          name: 'ServerError',
          error: new ServerError(result.data.errors[0].detail, result.data),
        },
      };
    } else {
      return {
        ok: false,
        val: {
          name: 'UnknownError',
          error: new UnknownError(
            `${response.status}: ${response.statusText} - Unhandled Error`,
            response.status,
            response.statusText,
          ),
        },
      };
    }
  }
}
