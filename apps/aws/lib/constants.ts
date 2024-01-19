export const APEX_DOMAIN = 'wwyd.ai';

export const VPC_NAME = 'WWYD';
export const DB_CLUSTER_NAME = 'wwyd';
export const REDIS_CLUSTER_NAME = 'wwyd';

export const ACCOUNTS = {
  Organization: {
    name: 'WWYD Organization',
    alias: 'wwyd-organization',
    accountId: '054891264416',
    email: 'wwyd.organization@anabasis.dev',
  },
  Production: {
    name: 'WWYD Production',
    alias: 'wwyd-production',
    accountId: '162728859685',
    email: 'wwyd.production@anabasis.dev',
  },
};

export type DeploymentEnv = 'staging' | 'production';

export const APP_NAMES = ['Client'] as const;

export type AppName = (typeof APP_NAMES)[number];

export type AppDefinition = {
  name: AppName;
  subdomain: string;
};

export const APPS: Record<AppName, AppDefinition> = {
  Client: {
    name: 'Client',
    subdomain: APEX_DOMAIN,
  },
};

export type DNSRecord = {
  id: string;
  recordType: 'CNAME' | 'A' | 'AAAA';
  recordName: string;
  value: string;
};

export const DNS_RECORDS: DNSRecord[] = [];

export const GROUPS = {
  Admins: { name: 'Admins' },
  Developers: { name: 'Developers' },
};

export const USERS = [
  { userName: 'cte', groups: new Set(['Admins']) },
  { userName: 'aak', groups: new Set(['Admins']) },
];

/**
 * Manually provisioned resources:
 */

export const DELEGATION_SET_ID = 'N03882533H4UYOYAOR10Z';

export const ENV_SECRETS_ARN =
  'arn:aws:secretsmanager:us-west-1:162728859685:secret:ENV-CMKOxV';
