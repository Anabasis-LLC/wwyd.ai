/**
 * ApiRequestBody
 */

export type ApiRequestBody =
  | { type: 'json'; data: object }
  | { type: 'form-data'; data: FormData };

/**
 * ApiRequestOptions
 */

export type ApiRequestOptions = Omit<RequestInit, 'method' | 'body'> & {
  host?: string;
  path: string;
  body?: ApiRequestBody;
};

/**
 * FETCH
 */

function FETCH({
  method,
  host = '',
  path,
  body,
  headers = {},
  ...rest
}: ApiRequestOptions & { method: 'GET' | 'POST' | 'PATCH' | 'DELETE' }) {
  if (path[0] !== '/') {
    throw new Error('API path is not valid.');
  }

  if (method === 'GET' && typeof body !== 'undefined') {
    throw new Error('Cannot provide a `body` for GET requests.');
  }

  const request: RequestInit = rest;

  const defaultHeaders: HeadersInit = { Accept: 'application/json' };

  if (body?.type === 'json') {
    const json = JSON.stringify(body.data);
    defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';
    defaultHeaders['Content-Length'] = Buffer.byteLength(json).toString();
    request.body = json;
  } else if (body?.type === 'form-data') {
    request.body = body.data;
  }

  const options: RequestInit = {
    method,
    credentials: 'include',
    headers: { ...defaultHeaders, ...headers },
    ...request,
  };

  return fetch(`${host}${path}`, options);
}

/**
 * HTTP Verbs
 */

export const GET = (options: ApiRequestOptions) =>
  FETCH({ method: 'GET', ...options });

export const POST = (options: ApiRequestOptions) =>
  FETCH({ method: 'POST', ...options });

export const PATCH = (options: ApiRequestOptions) =>
  FETCH({ method: 'PATCH', ...options });

export const DELETE = (options: ApiRequestOptions) =>
  FETCH({ method: 'DELETE', ...options });
