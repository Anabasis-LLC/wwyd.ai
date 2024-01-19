// 3rd party
import { Suspense } from 'react';
import { Metadata } from 'next';

// lib
import { ServerEnv, getColorScheme } from '@/lib/server';
import { Analytics } from '@/components/shared';

// css
import './styles.css';

/**
 * metadata
 *
 * https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */

const url = ServerEnv.NEXTAUTH_URL;
const title = 'What Would You Do?';
const description = 'Unleashing creativity, one story at a time.';

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(url),
  openGraph: { type: 'website', url, title, description },
  twitter: { card: 'summary_large_image', site: url, title, description },
};

/**
 * Layout
 */

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body className={getColorScheme()} style={{ height: '100%' }}>
        <Suspense>
          <Analytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
