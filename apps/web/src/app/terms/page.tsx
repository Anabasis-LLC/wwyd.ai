// 3rd party
import { Metadata } from 'next';

// lib
import { ShellPage } from '@/app/shell-page';
import { Terms } from '@/components/features/static';

/**
 * metadata
 */

export const metadata: Metadata = { title: 'WWYD? - Terms of Service' };

/**
 * Page
 */

export default async function Page() {
  return (
    <ShellPage requireAuthentication={false} footer={true}>
      <Terms />
    </ShellPage>
  );
}
