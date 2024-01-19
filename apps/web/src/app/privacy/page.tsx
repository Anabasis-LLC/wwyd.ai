// 3rd party
import { Metadata } from 'next';

// lib
import { ShellPage } from '@/app/shell-page';
import { Privacy } from '@/components/features/static';

/**
 * metadata
 */

export const metadata: Metadata = { title: 'WWYD? - Privacy Policy' };

/**
 * Page
 */

export default async function Page() {
  return (
    <ShellPage requireAuthentication={false} footer={true}>
      <Privacy />
    </ShellPage>
  );
}
