// lib
import { useSessionUser } from './use-session-user';

/**
 * useRequiredSessionUser
 */

export function useRequiredSessionUser() {
  const user = useSessionUser();

  if (!user) {
    throw new Error(
      `useRequiredSession can only be used when you're sure that a session is available.`,
    );
  }

  return user;
}
