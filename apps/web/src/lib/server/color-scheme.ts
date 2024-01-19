// 3rd party
import { cookies } from 'next/headers';

// lib
import { defaultColorScheme } from '@/theme';

/**
 * getColorScheme
 *
 * TODO: Can we cache this?
 * https://nextjs.org/docs/app/building-your-application/data-fetching/caching#react-cache
 */

export const getColorScheme = () =>
  cookies().get('color-scheme')?.value || defaultColorScheme;
