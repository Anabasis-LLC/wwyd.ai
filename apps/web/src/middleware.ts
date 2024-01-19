// 3rd party
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * middleware
 *
 * https://nextjs.org/docs/app/building-your-application/routing/middleware#producing-a-response
 *
 * Require authorization for all API requests except those in the `/api/auth`
 * namespace.
 */

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith('/api/auth') ||
    pathname.match(/^\/api\/stories$/g) ||
    pathname.match(/^\/api\/stories\/[\w-]+\/story-chapters\/\w+$/g)
  ) {
    return;
  }

  // Retrieve and decode the JWT stored in our session cookie.
  // https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken
  const id = (await getToken({ req }))?.sub;

  // If authorized, populate the `x-session-user-id` header.
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#setting-headers
  if (id) {
    const headers = new Headers(req.headers);
    headers.set('x-session-user-id', id);
    return NextResponse.next({ request: { headers } });
  } else {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }
}

// Limit the middleware to paths starting with `/api/`.
export const config = {
  matcher: '/api/:function*',
};
