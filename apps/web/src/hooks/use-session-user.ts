// 3rd party
import { useContext } from 'react';

// lib
import { SessionContext } from '@/components/shared';

/**
 * useSessionUser
 */

export function useSessionUser() {
  if (!SessionContext) {
    throw new Error('React Context is unavailable in server components.');
  }

  const value = useContext(SessionContext);

  if (!value) {
    throw new Error(
      '`useSessionUser` must be wrapped in a <SessionProvider />',
    );
  }

  return value.sessionUser;
}
