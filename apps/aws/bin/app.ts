#!/usr/bin/env node

// Construct Library:
// https://constructs.dev/search?q=&cdk=aws-cdk&cdkver=2&langs=typescript&sort=downloadsDesc&offset=0

// 3rd party
import { App } from 'aws-cdk-lib';

// lib
import {
  ACCOUNTS,
  APEX_DOMAIN,
  APPS,
  DNS_RECORDS,
  DELEGATION_SET_ID,
  VPC_NAME,
  DB_CLUSTER_NAME,
  REDIS_CLUSTER_NAME,
  ENV_SECRETS_ARN,
} from '../lib/constants';
import { OrgStack, InfraStack, AppsStack } from '../lib/stacks';

/**
 * DEPLOY_SHA, CDK_DEFAULT_REGION
 */

if (!process.env.DEPLOY_SHA) {
  throw new Error('DEPLOY_SHA must be specified.');
}

if (!process.env.CDK_DEFAULT_REGION) {
  throw new Error('CDK_DEFAULT_REGION must be specified.');
}

/**
 * App
 */

const app = new App();

/**
 * Stacks
 */

const _orgStack = new OrgStack(app, 'OrgStack', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: ACCOUNTS.Organization.accountId,
  },
});

const { vpc, apexHostedZone, hostedZones, repository, envSecret } =
  new InfraStack(app, 'InfraStack', {
    env: {
      region: process.env.CDK_DEFAULT_REGION,
      account: ACCOUNTS.Production.accountId,
    },
    apexDomain: APEX_DOMAIN,
    delegationSetId: DELEGATION_SET_ID,
    dnsRecords: DNS_RECORDS,
    apps: APPS,
    vpcName: VPC_NAME,
    dbClusterName: DB_CLUSTER_NAME,
    redisClusterName: REDIS_CLUSTER_NAME,
    envSecretsArn: ENV_SECRETS_ARN,
  });

const _appsStack = new AppsStack(app, 'AppsStack', {
  env: {
    region: process.env.CDK_DEFAULT_REGION,
    account: ACCOUNTS.Production.accountId,
  },
  vpc,
  apexHostedZone,
  hostedZones,
  repository,
  envSecret,
  deploySha: process.env.DEPLOY_SHA,
});

/**
 * synth
 */

app.synth();
