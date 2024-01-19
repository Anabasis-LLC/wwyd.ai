// local
import { POST } from '../fetch';
import { executeRequest } from '../execute-request';
import { CreateImageResponseSchema } from '../schemas';

/**
 * createImage
 */

export const createImage = (file: File) => {
  const data = new FormData();
  data.append('file', file);

  return executeRequest({
    request: POST({
      path: '/api/images',
      body: { type: 'form-data', data },
    }),
    schema: CreateImageResponseSchema,
  });
};
