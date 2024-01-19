// 3rd party
import { Metadata } from 'next';

// lib
import { ShellPage } from '@/app/shell-page';
import { CreateStory } from '@/components/features/create-story';

/**
 * metadata
 */

export const metadata: Metadata = { title: 'WWYD? - Create Story' };

/**
 * Page
 */

export default async function Page() {
  return (
    <ShellPage>
      <CreateStory />
    </ShellPage>
  );
}
