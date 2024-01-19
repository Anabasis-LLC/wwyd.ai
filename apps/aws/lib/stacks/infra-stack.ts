/* eslint-disable @typescript-eslint/no-unused-vars */

// 3rd party
import {
  Stack,
  StackProps,
  Duration,
  RemovalPolicy,
  CfnOutput,
  aws_iam as iam,
  aws_route53 as route53,
  aws_ec2 as ec2,
  aws_logs as logs,
  aws_secretsmanager as secretsmanager,
  aws_s3 as s3,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as cloudfront_origins,
  aws_ecr as ecr,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

// lib
import {
  DeploymentEnv,
  AppName,
  AppDefinition,
  DNSRecord,
  ACCOUNTS,
} from '../constants';
import { PublicHostedZoneWithReusableDelegationSet } from '../constructs/public-hosted-zone-with-reusable-delegation-set';
import { BastionVpc } from '../constructs/bastion-vpc';
import { PostgresCluster } from '../constructs/postgres-cluster';
import { RedisCluster } from '../constructs/redis-cluster';

export interface InfraStackProps extends StackProps {
  deploymentEnv?: DeploymentEnv;
  apexDomain: string;
  delegationSetId: string;
  dnsRecords: DNSRecord[];
  apps: Record<AppName, AppDefinition>;
  vpcName: string;
  dbClusterName: string;
  redisClusterName: string;
  envSecretsArn: string;
}

export class InfraStack extends Stack {
  public readonly adminRole: iam.Role;
  public readonly apexHostedZone: route53.IHostedZone;
  public readonly hostedZones: Record<AppName, route53.IHostedZone>;
  public readonly crossAccountZoneDelegationRecords: route53.CrossAccountZoneDelegationRecord[];
  public readonly vpc: BastionVpc;
  public readonly postgresCluster: PostgresCluster;
  public readonly redisCluster: RedisCluster;
  public readonly s3Role: iam.Role;
  public readonly s3Buckets: Record<string, s3.Bucket>;
  public readonly cloudfrontDistributions: Record<
    string,
    cloudfront.Distribution
  >;
  public readonly repository: ecr.Repository;
  public readonly envSecret: secretsmanager.ISecret;

  constructor(
    scope: Construct,
    id: string,
    {
      deploymentEnv = 'production',
      apexDomain,
      delegationSetId,
      dnsRecords,
      apps,
      vpcName,
      dbClusterName,
      redisClusterName,
      envSecretsArn,
      ...props
    }: InfraStackProps,
  ) {
    super(scope, id, props);

    this.adminRole = new iam.Role(this, 'AdminRole', {
      roleName: 'Admin',
      assumedBy: new iam.PrincipalWithConditions(
        new iam.AccountPrincipal(ACCOUNTS.Organization.accountId),
        {},
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      ],
    });

    /**
     * Route53
     *
     * We create an "apex" hosted zone for the domain root.
     * If we wish to create a zone for a subdomain in a different AWS account
     * we can create a cross account zone delegation record.
     *
     * https://gavinlewis.medium.com/managing-route-53-in-a-multi-account-environment-5d95a3cb67c5
     */

    const zone = new PublicHostedZoneWithReusableDelegationSet(
      this,
      'PublicHostedZone',
      {
        zoneName: apexDomain,
        delegationSetId,
        crossAccountZoneDelegationRoleName: 'CrossAccountZoneDelegationRole',
        crossAccountZoneDelegationPrincipal: new iam.CompositePrincipal(
          new iam.AccountPrincipal(ACCOUNTS.Organization.accountId),
          new iam.AccountPrincipal(ACCOUNTS.Production.accountId),
        ),
      },
    );

    this.apexHostedZone = zone;

    dnsRecords.forEach(({ id, recordType, recordName, value }) => {
      switch (recordType) {
        case 'CNAME': {
          new route53.CnameRecord(this, id, {
            zone,
            recordName,
            domainName: value,
          });

          break;
        }
        case 'A': {
          new route53.ARecord(this, id, {
            zone,
            recordName,
            target: route53.RecordTarget.fromIpAddresses(value),
          });

          break;
        }
        case 'AAAA': {
          new route53.AaaaRecord(this, id, {
            zone,
            recordName,
            target: route53.RecordTarget.fromIpAddresses(value),
          });

          break;
        }
      }
    });

    this.hostedZones = Object.values(apps).reduce<
      Record<string, route53.IHostedZone>
    >((accumulator, { name, subdomain }) => {
      const zone =
        subdomain === apexDomain
          ? this.apexHostedZone
          : new route53.PublicHostedZone(
              this,
              `${name}DelegatedPublicHostedZone`,
              { zoneName: subdomain },
            );

      return { ...accumulator, [name]: zone };
    }, {});

    this.crossAccountZoneDelegationRecords = [];

    Object.entries(this.hostedZones).forEach(([name, delegatedZone]) => {
      if (delegatedZone.zoneName !== apexDomain) {
        this.crossAccountZoneDelegationRecords.push(
          new route53.CrossAccountZoneDelegationRecord(
            this,
            `${name}CrossAccountZoneDelegationRecord`,
            {
              delegatedZone,
              parentHostedZoneName: apexDomain,
              delegationRole: iam.Role.fromRoleArn(
                this,
                `${name}CrossAccountZoneDelegationRole`,
                Stack.of(this).formatArn({
                  region: '',
                  service: 'iam',
                  account: ACCOUNTS.Production.accountId,
                  resource: 'role',
                  resourceName: 'CrossAccountZoneDelegationRole',
                }),
              ),
            },
          ),
        );
      }
    });

    /**
     * EC2
     */

    this.vpc = new BastionVpc(this, 'Vpc', { vpcName });

    /**
     * RDS
     */

    this.postgresCluster = new PostgresCluster(this, 'PostgresCluster', {
      vpc: this.vpc,
      clusterIdentifier: dbClusterName,
      cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
      instances: 1,
      removalPolicy: RemovalPolicy.SNAPSHOT,
      backup: { retention: Duration.days(7) },
      instanceProps: {
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.R6G,
          ec2.InstanceSize.LARGE,
        ),
      },
      secretName: 'PostgresClusterCredentials',
    });

    /**
     * Elasticache
     */

    this.redisCluster = new RedisCluster(this, 'RedisCluster', {
      vpc: this.vpc,
      engineVersion: '7.0',
      cacheNodeType: 'cache.r6g.large',
      clusterName: redisClusterName,
      numCacheNodes: 1,
    });

    /**
     * S3
     */

    this.s3Role = new iam.Role(this, 'S3Role', {
      roleName: 'S3',
      assumedBy: new iam.PrincipalWithConditions(
        new iam.AccountPrincipal(ACCOUNTS.Organization.accountId),
        {},
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
      ],
    });

    this.s3Buckets = {
      development: new s3.Bucket(this, 'DevelopmentBucket', {
        bucketName: 'wwyd-development',
        removalPolicy: RemovalPolicy.DESTROY,
      }),
      production: new s3.Bucket(this, 'Bucket', {
        bucketName: 'wwyd-production',
        removalPolicy: RemovalPolicy.DESTROY,
      }),
    };

    /**
     * CloudFront
     */

    this.cloudfrontDistributions = {
      development: new cloudfront.Distribution(
        this,
        'DevelopmentDistribution',
        {
          defaultBehavior: {
            origin: new cloudfront_origins.S3Origin(this.s3Buckets.development),
          },
          priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
        },
      ),
      production: new cloudfront.Distribution(this, 'Distribution', {
        defaultBehavior: {
          origin: new cloudfront_origins.S3Origin(this.s3Buckets.production),
        },
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      }),
    };

    /**
     * ECR
     */

    this.repository = new ecr.Repository(this, 'Repository', {
      repositoryName: 'repository',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, 'RepositoryUri', {
      value: this.repository.repositoryUri,
    });

    /**
     * Secrets Manager - ENV
     *
     * Per https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_secretsmanager-readme.html,
     * "If you need to use a pre-existing secret, the recommended way is to
     * manually provision the secret in AWS SecretsManager and use the
     * Secret.fromSecretArn to make it available in your CDK Application."
     */

    this.envSecret = secretsmanager.Secret.fromSecretCompleteArn(
      this,
      'EnvSecret',
      envSecretsArn,
    );

    new CfnOutput(this, 'EnvSecretName', {
      value: this.envSecret.secretName,
    });
  }
}
