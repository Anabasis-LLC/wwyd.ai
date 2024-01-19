// 3rd party
import { redirect } from 'next/navigation';

// lib
import { getSessionUser } from '@/lib/server';
import { ShellPage } from '@/app/shell-page';
import { GetStarted } from '@/components/features/get-started';

/**
 * Page
 */

export default async function Page() {
  const isAuthenticated = (await getSessionUser()) !== null;

  if (isAuthenticated) {
    redirect('/');
  }

  return (
    <ShellPage
      requireAuthentication={false}
      container={false}
      header={false}
      footer={true}
    >
      <GetStarted />
    </ShellPage>
  );
}
