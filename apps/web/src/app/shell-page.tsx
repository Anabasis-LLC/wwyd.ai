// lib
import { getSessionUser, getColorScheme } from '@/lib/server';

// package
import type { User } from '@wwyd/db';

// local
import {
  SessionProvider,
  Shell,
  FullScreen,
  Warning,
} from '@/components/shared';

/**
 * ShellPage
 */

export type ShellPageProps = {
  sessionUser?: User | null;
  requireAuthentication?: boolean;
  container?: boolean;
  header?: boolean;
  footer?: boolean;
  children: React.ReactNode;
};

export async function ShellPage({
  sessionUser,
  requireAuthentication = true,
  container = true,
  header = true,
  footer = false,
  children,
}: ShellPageProps) {
  const user =
    typeof sessionUser === 'undefined' ? await getSessionUser() : sessionUser;

  return (
    <SessionProvider user={user}>
      <Shell
        initialColorScheme={getColorScheme()}
        container={container}
        header={header}
        footer={footer}
      >
        {requireAuthentication === false || user !== null ? (
          children
        ) : (
          <FullScreen>
            <Warning message="Not Authorized" />
          </FullScreen>
        )}
      </Shell>
    </SessionProvider>
  );
}
