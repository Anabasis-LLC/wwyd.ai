'use client';

// 3rd party
import { createContext, useEffect, useState } from 'react';

// package
import type { User } from '@wwyd/db';

/**
 * SessionContext
 */

export type SessionContextValue = {
  sessionUser?: User | null;
  setSessionUser: (user?: User | null) => void;
};

export const SessionContext = createContext<SessionContextValue>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSessionUser: () => {},
});

/**
 * SessionProvider
 */

let __user: User | undefined;

export type SessionProviderProps = {
  user: User | null;
  children: React.ReactNode;
};

export function SessionProvider({ user, ...props }: SessionProviderProps) {
  const [sessionUser, setSessionUser] = useState<User | null | undefined>(user);

  useEffect(() => {
    if (user && !__user) {
      __user = user;
      setSessionUser(__user);
    }
  }, [user]);

  if (!SessionContext) {
    throw new Error('React Context is unavailable in server components.');
  }

  return (
    <SessionContext.Provider
      value={{ sessionUser, setSessionUser }}
      {...props}
    />
  );
}
