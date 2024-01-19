// 3rd party
import {
  aws_rds as rds,
  aws_ec2 as ec2,
  aws_kms as kms,
  Duration,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface PostgresClusterProps
  extends Omit<
    rds.DatabaseClusterProps,
    'cloudwatchLogsExports' | 'engine' | 'instanceProps'
  > {
  vpc: ec2.Vpc;
  instanceProps: Omit<rds.DatabaseClusterProps['instanceProps'], 'vpc'>;
  secretName: string;
}

export class PostgresCluster extends Construct {
  vpc: ec2.Vpc;
  securityGroup: ec2.ISecurityGroup;
  encryptionKey: kms.Key;
  databaseCluster: rds.DatabaseCluster;

  constructor(
    scope: Construct,
    id: string,
    { vpc, instanceProps, secretName, ...rest }: PostgresClusterProps,
  ) {
    super(scope, id);

    this.vpc = vpc;

    this.securityGroup = new ec2.SecurityGroup(this, 'PostgresSecurityGroup', {
      vpc: this.vpc,
      allowAllOutbound: true,
    });

    this.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432));

    this.encryptionKey = new kms.Key(this, 'PostgresEncryptionKey');

    this.databaseCluster = new rds.DatabaseCluster(
      this,
      'PostgresDatabaseCluster',
      {
        credentials: rds.Credentials.fromGeneratedSecret('postgres', {
          secretName,
        }),
        engine: rds.DatabaseClusterEngine.auroraPostgres({
          version: rds.AuroraPostgresEngineVersion.VER_14_6,
        }),
        storageEncrypted: !!this.encryptionKey,
        storageEncryptionKey: this.encryptionKey,
        cloudwatchLogsExports: ['postgresql'],
        // parameters: {
        //   log_statement: 'all',
        //   log_min_duration_statement: '2000',
        // },
        instanceProps: {
          vpc: this.vpc,
          vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
          securityGroups: [this.securityGroup],
          publiclyAccessible: true,
          enablePerformanceInsights: true,
          ...instanceProps,
        },
        monitoringInterval: Duration.seconds(30),
        ...rest,
      },
    );
  }
}
