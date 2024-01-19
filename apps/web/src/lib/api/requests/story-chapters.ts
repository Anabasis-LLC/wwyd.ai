// local
import { GET, POST } from '../fetch';
import { executeRequest } from '../execute-request';
import {
  GetStoryChapterRequest,
  GetStoryChapterResponseSchema,
  CreateStoryChapterRequest,
  CreateStoryChapterResponseSchema,
} from '../schemas';

/**
 * getStoryChapter
 */

export const getStoryChapter = ({ uuid, path }: GetStoryChapterRequest) =>
  executeRequest({
    request: GET({
      path: `/api/stories/${uuid}/story-chapters/${path}`,
    }),
    schema: GetStoryChapterResponseSchema,
  });

/**
 * createStoryChapter
 */

export const createStoryChapter = (data: CreateStoryChapterRequest) =>
  executeRequest({
    request: POST({
      path: '/api/story-chapters',
      body: { type: 'json', data },
    }),
    schema: CreateStoryChapterResponseSchema,
  });
