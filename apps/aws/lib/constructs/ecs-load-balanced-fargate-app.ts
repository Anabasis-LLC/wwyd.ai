// 3rd party
import {
  aws_ec2 as ec2,
  aws_route53 as route53,
  aws_ecs_patterns as ecsPatterns,
  aws_elasticloadbalancingv2 as elb,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

// lib
import { EcsBaseApp, EcsBaseAppProps } from './ecs-base-app';

/**
 * EcsLoadBalancedFargateApp
 */

export type EcsLoadBalancedFargateAppProps = EcsBaseAppProps & {
  securityGroups?: ec2.SecurityGroup[];
  domainZone: route53.IHostedZone;
  containerPort: number;
  sticky?: boolean;
};

export class EcsLoadBalancedFargateApp extends EcsBaseApp {
  public readonly service: ecsPatterns.ApplicationLoadBalancedFargateService;

  constructor(
    scope: Construct,
    id: string,
    {
      securityGroups,
      domainZone,
      containerPort,
      sticky,
      ...props
    }: EcsLoadBalancedFargateAppProps,
  ) {
    super(scope, id, props);

    const { name, cluster, desiredCount, enableExecuteCommand = true } = props;

    this.container.addPortMappings({
      containerPort,
    });

    // https://github.com/aws/aws-cdk/blob/main/packages/@aws-cdk/aws-ecs-patterns/lib/base/application-load-balanced-service-base.ts
    // https://github.com/aws/aws-cdk/blob/main/packages/%40aws-cdk/aws-ecs-patterns/lib/fargate/application-load-balanced-fargate-service.ts
    this.service = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      `${name}Service`,
      {
        cluster,
        serviceName: `${name}Service`,
        assignPublicIp: true,
        securityGroups,
        protocol: elb.ApplicationProtocol.HTTPS,
        redirectHTTP: true,
        loadBalancerName: `${name}LoadBalancer`,
        domainName: domainZone.zoneName,
        domainZone,
        desiredCount,
        enableExecuteCommand,
        taskDefinition: this.taskDefinition,
      },
    );

    // https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/load-balancer-connection-draining.html
    // The amount of time for the LB to wait before
    // de-registering a target. The range is 0–3600 seconds. The default value is
    // 300 seconds.
    this.service.targetGroup.setAttribute(
      'deregistration_delay.timeout_seconds',
      '5',
    );

    if (sticky) {
      // Indicates whether sticky sessions are enabled. This should be enabled
      // for things like WebSocket servers.
      this.service.targetGroup.setAttribute('stickiness.enabled', 'true');
    }
  }
}
