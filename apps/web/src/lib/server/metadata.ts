// 3rd party
import { Metadata, ResolvingMetadata } from 'next';

// package
import { db } from '@wwyd/db';

// local
import { ServerEnv } from './env';
import { cdnUrl } from '../cdn';

/**
 * generateStoryMetadata
 */

export const generateStoryMetadata = async ({
  slug,
}: {
  slug: string;
  parent: ResolvingMetadata;
}): Promise<Metadata> => {
  // TODO: https://nextjs.org/docs/app/building-your-application/data-fetching/caching#react-cache
  const story = await db.story.findUnique({
    where: { slug },
    include: { coverImage: true },
  });

  if (!story) {
    return {};
  }

  const url = `${ServerEnv.NEXTAUTH_URL}/stories/${story.slug}`;
  const title = `${story.title} - WWYD?`;
  const description = story.tagline;
  const images = {
    url: cdnUrl(story.coverImage.key),
    width: story.coverImage.width || undefined,
    height: story.coverImage.height || undefined,
  };

  return {
    title,
    description,
    openGraph: { type: 'website', url, title, description, images },
    twitter: {
      card: 'summary_large_image',
      site: url,
      title,
      description,
      images,
    },
  };
};
