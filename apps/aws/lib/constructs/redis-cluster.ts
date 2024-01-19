// 3rd party
import {
  aws_ec2 as ec2,
  aws_elasticache as elasticache,
  // aws_secretsmanager as secretsmanager,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

/**
 * RedisCluster
 *
 * Useful example: https://github.com/devopsrepohq/redis/blob/master/lib/redis-stack.ts
 */

export interface RedisClusterProps
  extends Omit<
    elasticache.CfnCacheClusterProps,
    'engine' | 'subnetIds' | 'securityGroupIds'
  > {
  vpc: ec2.Vpc;
}

export class RedisCluster extends Construct {
  vpc: ec2.Vpc;
  subnetGroup: elasticache.CfnSubnetGroup;
  cacheCluster: elasticache.CfnCacheCluster;
  securityGroups: ec2.ISecurityGroup[];
  ingressRules: Array<{ peer: ec2.IPeer; connection: ec2.Port }> | undefined;

  constructor(
    scope: Construct,
    id: string,
    { vpc, ...props }: RedisClusterProps,
  ) {
    super(scope, id);

    this.vpc = vpc;

    this.ingressRules = [
      { peer: ec2.Peer.anyIpv4(), connection: ec2.Port.tcp(6379) },
    ];

    this.securityGroups = [
      new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc: this.vpc,
        allowAllOutbound: true,
      }),
    ];

    this.ingressRules.forEach(({ peer, connection }) =>
      this.securityGroups[0].addIngressRule(peer, connection),
    );

    this.subnetGroup = new elasticache.CfnSubnetGroup(
      this,
      'RedisServicePrivateSubnetGroup',
      {
        description: 'Redis Subnet',
        subnetIds: this.vpc.publicSubnets.map((subnet) => subnet.subnetId),
      },
    );

    this.cacheCluster = new elasticache.CfnCacheCluster(
      this,
      `RedisReplicaGroup`,
      {
        engine: 'redis',
        autoMinorVersionUpgrade: true,
        cacheSubnetGroupName: this.subnetGroup.ref,
        vpcSecurityGroupIds: this.securityGroups.map(
          (group) => group.securityGroupId,
        ),
        // logDeliveryConfigurations: [
        //   {
        //     destinationDetails: {
        //       cloudWatchLogsDetails: { logGroup: 'logGroup' },
        //     },
        //     destinationType: 'cloudwatch-logs',
        //     logFormat: 'json',
        //     logType: 'slow-log',
        //   },
        // ],
        ...props,
      },
    );

    this.cacheCluster.addDependency(this.subnetGroup);
  }
}
