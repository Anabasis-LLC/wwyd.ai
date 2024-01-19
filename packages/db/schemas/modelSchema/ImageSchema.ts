import { z } from 'zod';

/////////////////////////////////////////
// IMAGE SCHEMA
/////////////////////////////////////////

export const ImageSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  filename: z.string(),
  contentType: z.string(),
  byteSize: z.number().int(),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  checksum: z.string(),
  key: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Image = z.infer<typeof ImageSchema>;

export default ImageSchema;
