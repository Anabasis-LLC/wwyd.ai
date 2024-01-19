import { z } from 'zod';

/////////////////////////////////////////
// STORY CHAPTER SCHEMA
/////////////////////////////////////////

export const StoryChapterSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  storyId: z.number().int(),
  storyEndingId: z.number().int().nullable(),
  number: z.number().int(),
  path: z.string(),
  text: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type StoryChapter = z.infer<typeof StoryChapterSchema>;

export default StoryChapterSchema;
