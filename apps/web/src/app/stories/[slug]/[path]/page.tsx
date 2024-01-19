// 3rd party
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

// package
import { db } from '@wwyd/db';

// lib
import { generateStoryMetadata, getSessionUserId } from '@/lib/server';
import { ShellPage } from '@/app/shell-page';
import { ReadStory } from '@/components/features/read-story';

/**
 * Params
 */

type Params = { params: { slug: string; path: string } };

/**
 * metadata
 */

export async function generateMetadata(
  { params: { slug } }: Params,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return generateStoryMetadata({ slug, parent });
}

/**
 * Page: /stories/[slug]/[path]
 */

export default async function Page({ params: { slug, path } }: Params) {
  const userId = await getSessionUserId();

  const story = await db.story.findUnique({
    where: { slug },
    include: { coverImage: true },
  });

  const userChoice =
    userId && story
      ? await db.userStoryChoice.findUnique({
          where: { userId_storyId_path: { userId, storyId: story.id, path } },
          include: { choice: true },
        })
      : null;

  if (!userId || !story || !userChoice) {
    notFound();
  }

  return (
    <ShellPage container={false}>
      <ReadStory story={story} userChoice={userChoice} />
    </ShellPage>
  );
}
