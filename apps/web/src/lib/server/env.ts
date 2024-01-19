/**
 * ServerEnv
 */

type ServerEnvVar = (typeof ServerEnvVars)[number];

const ServerEnvVars = [
  'DEPLOY_SHA',
  'AWS_REGION',
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'FACEBOOK_CLIENT_SECRET',
  'GOOGLE_CLIENT_SECRET',
  'TWITTER_CLIENT_SECRET',
  'DISCORD_CLIENT_SECRET',
] as const;

const ServerEnv = {
  DEPLOY_SHA: process.env.DEPLOY_SHA,
  AWS_REGION: process.env.AWS_REGION,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
} as Record<ServerEnvVar, string>;

Object.entries(ServerEnv).forEach(([key, value]) => {
  if (typeof value === 'undefined') {
    throw new Error(`Required server ENV var is not defined: ${key}`);
  }
});

export { ServerEnv };
