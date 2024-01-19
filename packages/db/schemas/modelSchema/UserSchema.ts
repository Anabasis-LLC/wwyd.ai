import { z } from 'zod';

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  email: z.string(),
  name: z.string(),
  encryptedPassword: z.string().nullable(),
  magicTokenSalt: z.string().nullable(),
  timeZone: z.string(),
  emailVerifiedAt: z.coerce.date().nullable(),
  avatarUrl: z.string().nullable(),
  avatarId: z.number().int().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

export default UserSchema;
