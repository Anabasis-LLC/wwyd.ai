// 3rd party
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { headers, cookies } from 'next/headers';

// package
import { db } from '@wwyd/db';

/**
 * sessionUserId
 */

export const sessionUserId = (req: NextRequest) =>
  parseInt(req.headers.get('x-session-user-id')!); // eslint-disable-line @typescript-eslint/no-non-null-assertion

/**
 * getSessionToken
 */

export const getSessionToken = async (request?: NextRequest) => {
  // https://github.com/nextauthjs/next-auth/issues/5754
  const req =
    request ||
    ({
      headers: Object.fromEntries(headers()),
      cookies: Object.fromEntries(
        cookies()
          .getAll()
          .map((c) => [c.name, c.value]),
      ),
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

  return getToken({ req });
};

/**
 * getSessionUserId
 */

export const getSessionUserId = async (request?: NextRequest) => {
  const token = await getSessionToken(request);
  return token?.sub ? parseInt(token.sub) : null;
};

/**
 * getSessionUser
 */

export const getSessionUser = async (request?: NextRequest) => {
  const id = await getSessionUserId(request);
  return id ? await db.user.findUnique({ where: { id } }) : null;
};
