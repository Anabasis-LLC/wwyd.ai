/**
 * cdnUrl
 */

export const cdnUrl = (key: string) =>
  process.env.NODE_ENV === 'production'
    ? `https://d159rg6y18squf.cloudfront.net/${key}`
    : `https://dpvwzih39a40f.cloudfront.net/${key}`;
