import { z } from 'zod';

/////////////////////////////////////////
// STORY SCHEMA
/////////////////////////////////////////

export const StorySchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  userId: z.number().int(),
  coverImageId: z.number().int(),
  slug: z.string(),
  title: z.string(),
  tagline: z.string(),
  hook: z.string(),
  chapterCount: z.number().int(),
  choiceCount: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Story = z.infer<typeof StorySchema>;

export default StorySchema;
