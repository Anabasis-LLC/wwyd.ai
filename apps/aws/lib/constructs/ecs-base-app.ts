// 3rd party
import { aws_ecr as ecr, aws_ecs as ecs, aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';

// lib
import { DeploymentEnv } from '../constants';

/**
 * EcsBaseApp
 */

export type EcsBaseAppProps = {
  deploymentEnv?: DeploymentEnv;
  name: string;
  cluster: ecs.Cluster;
  repositoryName: string;
  repositoryArn: string;
  repositoryTag: string;
  taskRole: iam.Role;
  desiredCount: number;
  cpu: number;
  memoryLimitMiB: number;
  enableExecuteCommand?: boolean;
  environment?: { [key: string]: string };
  secrets?: { [key: string]: ecs.Secret };
  logDriver?: ecs.LogDriver;
  command?: string[];
  healthCheck?: ecs.HealthCheck;
};

export class EcsBaseApp extends Construct {
  public readonly taskImage: ecs.EcrImage;
  public readonly taskDefinition: ecs.FargateTaskDefinition;
  public readonly container: ecs.ContainerDefinition;

  constructor(
    scope: Construct,
    id: string,
    {
      name,
      repositoryName,
      repositoryArn,
      repositoryTag,
      taskRole,
      cpu,
      memoryLimitMiB,
      environment = {},
      secrets,
      logDriver,
      command,
      healthCheck,
    }: EcsBaseAppProps,
  ) {
    super(scope, id);

    this.taskImage = ecs.ContainerImage.fromEcrRepository(
      ecr.Repository.fromRepositoryAttributes(this, `${name}Repository`, {
        repositoryName,
        repositoryArn,
      }),
      repositoryTag,
    );

    this.taskDefinition = new ecs.FargateTaskDefinition(
      this,
      `${name}TaskDefinition`,
      {
        cpu,
        memoryLimitMiB,
        family: `${name}TaskDefinition`,
        taskRole,
      },
    );

    this.container = this.taskDefinition.addContainer(`${name}Container`, {
      containerName: `${name}Container`,
      image: this.taskImage,
      environment,
      secrets,
      command,
      logging: logDriver,
      linuxParameters: new ecs.LinuxParameters(this, `${name}LinuxParameters`, {
        initProcessEnabled: true,
      }),
      healthCheck,
    });
  }
}
