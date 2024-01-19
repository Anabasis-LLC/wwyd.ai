/* eslint-disable no-console */

// 3rd party
import NextAuth from 'next-auth';

// lib
import { providers } from '@/lib/server';

/**
 * GET, POST
 */

const handler = NextAuth({
  providers,
  // debug: true,
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    verifyRequest: '/',
    newUser: '/',
  },
  // callbacks: {
  //   async signIn(params) {
  //     console.log('signIn', params);
  //     return true;
  //   },
  //   async redirect(params) {
  //     console.log('redirect', params);
  //     return params.baseUrl;
  //   },
  //   async session(params) {
  //     console.log('session', params);
  //     return params.session;
  //   },
  //   async jwt(params) {
  //     console.log('jwt', params);
  //     return params.token;
  //   },
  // },
});

export { handler as GET, handler as POST };
