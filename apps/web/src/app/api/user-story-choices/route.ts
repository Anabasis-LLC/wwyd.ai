// 3rd party
import { NextRequest, NextResponse } from 'next/server';

// lib
import { sessionUserId, createUserStoryChoice } from '@/lib/server';
import {
  CreateUserStoryChoiceRequestSchema,
  CreateUserStoryChoiceResponse,
  ErrorResponse,
} from '@/lib';

/**
 * POST /api/user-story-choices
 *
 * Called by `createUserStoryChoice`.
 */

export async function POST(
  request: NextRequest,
): Promise<NextResponse<CreateUserStoryChoiceResponse | ErrorResponse>> {
  const result = CreateUserStoryChoiceRequestSchema.safeParse(
    await request.json(),
  );

  if (!result.success) {
    return NextResponse.json(
      { status: 400, message: result.error.message },
      { status: 400 },
    );
  }

  const userStoryChoice = await createUserStoryChoice({
    userId: sessionUserId(request),
    ...result.data,
  });

  return NextResponse.json({ userStoryChoice });
}
