/**
 * ClientEnv
 *
 * https://nextjs.org/docs/basic-features/environment-variables
 *
 * Note that variable expansion is supported.
 */

type ClientEnvVar = (typeof ClientEnvVars)[number];

const ClientEnvVars = ['APP_NAME'] as const;

const ClientEnv = {
  APP_NAME: 'WWYD',
} as Record<ClientEnvVar, string>;

Object.entries(ClientEnv).forEach(([key, value]) => {
  if (typeof value === 'undefined') {
    throw new Error(`Required client ENV var is not defined: ${key}`);
  }
});

export { ClientEnv };
