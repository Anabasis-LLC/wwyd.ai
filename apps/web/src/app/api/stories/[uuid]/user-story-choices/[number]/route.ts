// 3rd party
import { NextRequest, NextResponse } from 'next/server';

// package
import { db } from '@wwyd/db';

// lib
import {
  GetUserStoryChoiceRequest,
  GetUserStoryChoiceResponse,
  ErrorResponse,
} from '@/lib';
import { sessionUserId } from '@/lib/server';

/**
 * GET /api/stories/[uuid]/user-story-choices/[number]
 *
 * Called by `getUserStoryChoices`.
 */

export async function GET(
  request: NextRequest,
  { params: { uuid, number } }: { params: GetUserStoryChoiceRequest },
): Promise<NextResponse<GetUserStoryChoiceResponse | ErrorResponse>> {
  const story = await db.story.findUniqueOrThrow({ where: { uuid } });

  const userChoice = await db.userStoryChoice.findFirst({
    where: {
      userId: sessionUserId(request),
      storyId: story.id,
      number: typeof number === 'string' ? parseInt(number) : number,
    },
    include: { choice: true },
  });

  return NextResponse.json({ userChoice });
}
