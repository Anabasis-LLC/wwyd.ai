// 3rd party
import { aws_ecs as ecs } from 'aws-cdk-lib';
import { Construct } from 'constructs';

// lib
import { EcsBaseApp, EcsBaseAppProps } from './ecs-base-app';

/**
 * EcsFargateApp
 */

export type EcsFargateAppProps = EcsBaseAppProps;

export class EcsFargateApp extends EcsBaseApp {
  public readonly service: ecs.FargateService;

  constructor(scope: Construct, id: string, props: EcsFargateAppProps) {
    super(scope, id, props);

    const { name, cluster, desiredCount, enableExecuteCommand = true } = props;

    // https://github.com/aws/aws-cdk/blob/main/packages/@aws-cdk/aws-ecs-patterns/lib/base/application-load-balanced-service-base.ts
    this.service = new ecs.FargateService(this, `${name}Service`, {
      cluster,
      serviceName: `${name}Service`,
      assignPublicIp: true,
      desiredCount,
      enableExecuteCommand,
      taskDefinition: this.taskDefinition,
    });
  }
}
