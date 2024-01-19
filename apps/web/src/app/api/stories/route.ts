// import
import { randomBytes } from 'crypto';

// 3rd party
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

// package
import { db } from '@wwyd/db';

// lib
import { sessionUserId } from '@/lib/server';
import {
  GetStoriesResponse,
  CreateStoryRequestSchema,
  CreateStoryResponse,
  ErrorResponse,
} from '@/lib';

/**
 * GET /api/stories
 *
 * Called by `getStories`.
 *
 * TODO: Cursor-based pagination.
 */

export async function GET(
  _request: NextRequest,
): Promise<NextResponse<GetStoriesResponse | ErrorResponse>> {
  const stories = await db.story.findMany({
    include: { user: true, coverImage: true },
    take: 30,
  });

  return NextResponse.json({ stories });
}

/**
 * POST /api/stories
 *
 * Called by `createStory`.
 */

export async function POST(
  request: NextRequest,
): Promise<NextResponse<CreateStoryResponse | ErrorResponse>> {
  const result = CreateStoryRequestSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json(
      { status: 400, message: result.error.message },
      { status: 400 },
    );
  }

  const { endings, cover, ...data } = result.data;

  const slugified = slugify(data.title, { lower: true, strict: true });
  let slug = slugified;

  while ((await db.story.findUnique({ where: { slug } })) !== null) {
    slug = `${slugified}-${randomBytes(4).toString('hex')}`;
  }

  const story = await db.story.create({
    data: {
      ...data,
      slug,
      choiceCount: 3, // TODO
      user: { connect: { id: sessionUserId(request) } },
      endings: { createMany: { data: endings } },
      coverImage: { connect: { id: cover.id } },
    },
  });

  return NextResponse.json({ story });
}
