// 3rd party
import {
  StackProps,
  Stack,
  Duration,
  aws_route53 as route53,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_secretsmanager as secretsmanager,
  aws_ecr as ecr,
  aws_iam as iam,
  aws_logs as logs,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

// lib
import { DeploymentEnv, AppName } from '../constants';
import { EcsLoadBalancedFargateApp } from '../constructs/ecs-load-balanced-fargate-app';

export type AppsStackProps = StackProps & {
  deploymentEnv?: DeploymentEnv;
  apexHostedZone: route53.IHostedZone;
  hostedZones: Record<AppName, route53.IHostedZone>;
  vpc: ec2.Vpc;
  repository: ecr.Repository;
  envSecret: secretsmanager.ISecret;
  deploySha: string;
};

export class AppsStack extends Stack {
  public readonly cluster: ecs.Cluster;
  public readonly taskRole: iam.Role;
  public readonly webApp: EcsLoadBalancedFargateApp;

  constructor(
    scope: Construct,
    id: string,
    {
      deploymentEnv = 'production',
      apexHostedZone,
      vpc,
      repository,
      envSecret,
      deploySha,
      ...props
    }: AppsStackProps,
  ) {
    super(scope, id, props);

    /**
     * Cluster
     */

    this.cluster = new ecs.Cluster(this, 'AppsCluster', {
      clusterName: 'Apps',
      containerInsights: true,
      vpc,
    });

    /**
     * Cluster Task Role
     */

    this.taskRole = new iam.Role(this, 'AppsClusterTaskRole', {
      roleName: 'AppsClusterTasks',
      assumedBy: new iam.PrincipalWithConditions(
        new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        {},
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSESFullAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonEC2ContainerRegistryPowerUser',
        ),
      ],
      inlinePolicies: {
        SSMPutItem: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              resources: ['*'],
              actions: ['ssm:*'],
              effect: iam.Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    /**
     * Shared ENV
     */

    const environment = {
      DEPLOY_SHA: deploySha,
    };

    /**
     * Shared Health Check Options
     */

    const elbHealthCheck = {
      path: '/health',
      interval: Duration.seconds(15),
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
      timeout: Duration.seconds(10),
    };

    const _containerHealthCheckOptions = {
      interval: elbHealthCheck.interval,
      retries: elbHealthCheck.unhealthyThresholdCount,
      timeout: elbHealthCheck.timeout,
    };

    /**
     * Shared App Options
     */

    const appOptions = {
      deploymentEnv,
      cluster: this.cluster,
      repositoryName: repository.repositoryName,
      repositoryArn: repository.repositoryArn,
      taskRole: this.taskRole,
      desiredCount: 1,
      cpu: 2048,
      memoryLimitMiB: 4096,
      environment,
    };

    /**
     * Web
     */

    this.webApp = new EcsLoadBalancedFargateApp(this, 'WebApp', {
      ...appOptions,
      name: 'Web',
      domainZone: apexHostedZone,
      repositoryTag: `web-${deploySha}`,
      secrets: {
        DATABASE_URL: ecs.Secret.fromSecretsManager(envSecret, 'DATABASE_URL'),
        NEXTAUTH_SECRET: ecs.Secret.fromSecretsManager(
          envSecret,
          'NEXTAUTH_SECRET',
        ),
        FACEBOOK_CLIENT_SECRET: ecs.Secret.fromSecretsManager(
          envSecret,
          'FACEBOOK_CLIENT_SECRET',
        ),
        GOOGLE_CLIENT_SECRET: ecs.Secret.fromSecretsManager(
          envSecret,
          'GOOGLE_CLIENT_SECRET',
        ),
        TWITTER_CLIENT_SECRET: ecs.Secret.fromSecretsManager(
          envSecret,
          'TWITTER_CLIENT_SECRET',
        ),
        DISCORD_CLIENT_SECRET: ecs.Secret.fromSecretsManager(
          envSecret,
          'DISCORD_CLIENT_SECRET',
        ),
        OPENAI_API_KEY: ecs.Secret.fromSecretsManager(
          envSecret,
          'OPENAI_API_KEY',
        ),
      },
      // command: ['node', 'apps/web/server.js'],
      containerPort: 3000,
      // NOTE: `curl` is not currently installed, so this always fails.
      // healthCheck: {
      //   command: [
      //     'CMD-SHELL',
      //     'curl -sSf http://localhost:3000 > /dev/null || exit 1',
      //   ],
      //   ...containerHealthCheckOptions,
      // },
      logDriver: ecs.LogDrivers.awsLogs({
        streamPrefix: 'web',
        logGroup: new logs.LogGroup(this, 'WebLogGroup', {
          logGroupName: 'Web',
          retention: logs.RetentionDays.ONE_WEEK,
        }),
      }),
    });

    this.webApp.service.targetGroup.configureHealthCheck({
      ...elbHealthCheck,
      path: '/',
    });
  }
}
