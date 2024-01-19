// 3rd party
import { z } from 'zod';

// package
import {
  StorySchema,
  StoryChapterSchema,
  StoryEndingSchema,
  StoryChoiceSchema,
  UserStoryChoiceSchema,
  ImageSchema,
  UserSchema,
} from '@wwyd/db/schemas/modelSchema';

/**
 * ErrorResponse
 */

export type ErrorResponse = { status: number; message: string };

/**
 * GetStoriesResponse
 */

export const GetStoriesResponseSchema = z.object({
  stories: z.array(
    StorySchema.extend({ user: UserSchema, coverImage: ImageSchema }),
  ),
});

export type GetStoriesResponse = z.infer<typeof GetStoriesResponseSchema>;

/**
 * CreateStoryRequest
 */

export const CreateStoryRequestSchema = z.object({
  hook: z.string().min(1, { message: 'This is required.' }),
  endings: z
    .array(
      z.object({
        text: z.string().min(1, { message: 'This is required.' }),
      }),
    )
    .min(2, { message: 'You cannot have fewer than 2 endings.' })
    .max(10, { message: 'You cannot have more than 10 endings.' }),
  chapterCount: z.coerce
    .number({
      invalid_type_error: 'This is required.',
      required_error: 'This is required.',
    })
    .min(2, { message: 'Must be 2 or more.' })
    .max(10, { message: 'Must be 10 or less.' }),
  cover: z.object(
    {
      id: z.number().int(),
      key: z.string(),
      width: z.number().int().nullable(),
      height: z.number().int().nullable(),
    },
    {
      invalid_type_error: 'This is required.',
      required_error: 'This is required.',
    },
  ),
  title: z
    .string()
    .min(1, { message: 'Title is required.' })
    .max(70, { message: 'Title must be 70 characters or less.' }),
  tagline: z
    .string()
    .min(1, { message: 'Tagline is required.' })
    .max(140, { message: 'Tagline must be 140 characters or less.' }),
});

export type CreateStoryRequest = z.infer<typeof CreateStoryRequestSchema>;

/**
 * CreateStoryResponse
 */

export const CreateStoryResponseSchema = z.object({ story: StorySchema });

export type CreateStoryResponse = z.infer<typeof CreateStoryResponseSchema>;

/**
 * CreateUserStoryChoiceRequest
 */

export const CreateUserStoryChoiceRequestSchema = z.object({
  storyId: z.number(),
  storyChoiceId: z.number(),
});

export type CreateUserStoryChoiceRequest = z.infer<
  typeof CreateUserStoryChoiceRequestSchema
>;

/**
 * GetUserStoryChoiceRequest
 */

export type GetUserStoryChoiceRequest = {
  uuid: string;
  number: number | string;
};

/**
 * GetUserStoryChoiceResponse
 */

export const GetUserStoryChoiceResponseSchema = z.object({
  userChoice: UserStoryChoiceSchema.extend({
    choice: StoryChoiceSchema,
  }).nullable(),
});

export type GetUserStoryChoiceResponse = z.infer<
  typeof GetUserStoryChoiceResponseSchema
>;

/**
 * CreateUserStoryChoiceResponse
 */

export const CreateUserStoryChoiceResponseSchema = z.object({
  userStoryChoice: UserStoryChoiceSchema.extend({
    story: StorySchema,
    choice: StoryChoiceSchema,
  }),
});

export type CreateUserStoryChoiceResponse = z.infer<
  typeof CreateUserStoryChoiceResponseSchema
>;

/**
 * GetStoryChapterRequest
 */

export type GetStoryChapterRequest = { uuid: string; path: string };

/**
 * GetStoryChapterResponse
 */

export const ChapterPromptSchema = z.object({
  number: z.number(),
  chapterCount: z.number(),
  hook: z.string(),
  tagline: z.string(),
  choices: z.array(
    z.object({
      id: z.number().int(),
      text: z.string(),
      summary: z.string(),
    }),
  ),
  endings: z.array(
    z.object({
      id: z.number().int(),
      text: z.string(),
    }),
  ),
});

export type ChapterPrompt = z.infer<typeof ChapterPromptSchema>;

export const GetStoryChapterResponseSchema = z.object({
  chapter: StoryChapterSchema.extend({
    ending: StoryEndingSchema.nullable(),
    choices: z.array(StoryChoiceSchema),
  }).nullable(),
  prompt: ChapterPromptSchema,
});

export type GetStoryChapterResponse = z.infer<
  typeof GetStoryChapterResponseSchema
>;

/**
 * CreateStoryChapterRequest
 */

export const CreateStoryChapterRequestSchema = z.object({
  storyId: z.number(),
  storyEndingId: z.number().optional(),
  path: z.string(),
  number: z.number().int(),
  text: z.string().min(1),
  choices: z.array(z.string()).length(3).optional(),
});

export type CreateStoryChapterRequest = z.infer<
  typeof CreateStoryChapterRequestSchema
>;

/**
 * CreateStoryChapterResponse
 */

export const CreateStoryChapterResponseSchema = z.object({
  chapter: StoryChapterSchema.extend({
    ending: StoryEndingSchema.nullable(),
    choices: z.array(StoryChoiceSchema),
  }),
});

export type CreateStoryChapterResponse = z.infer<
  typeof CreateStoryChapterResponseSchema
>;

/**
 * CreateImageResponse
 */

export const CreateImageResponseSchema = z.object({
  image: ImageSchema,
});

export type CreateImageResponse = z.infer<typeof CreateImageResponseSchema>;
