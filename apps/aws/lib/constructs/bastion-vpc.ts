// 3rd party
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface BastionVpcProps extends ec2.VpcProps {
  bastionInstanceType?: ec2.InstanceType;
}

export class BastionVpc extends ec2.Vpc {
  bastionImage?: ec2.IMachineImage;
  bastionHost?: ec2.BastionHostLinux;

  constructor(
    scope: Construct,
    id: string,
    { bastionInstanceType, ...rest }: BastionVpcProps,
  ) {
    // https://github.com/aws-samples/aws-cdk-examples/blob/master/typescript/ec2-instance/lib/ec2-cdk-stack.ts
    super(scope, id, {
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'asterisk',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
      ...rest,
    });

    // https://loige.co/provision-ubuntu-ec2-with-cdk/
    this.bastionImage = ec2.MachineImage.fromSsmParameter(
      '/aws/service/canonical/ubuntu/server/focal/stable/current/amd64/hvm/ebs-gp2/ami-id',
      { os: ec2.OperatingSystemType.LINUX },
    );

    const instanceType =
      bastionInstanceType ||
      ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO);

    this.bastionHost = new ec2.BastionHostLinux(this, 'BastionHost', {
      vpc: this,
      machineImage: this.bastionImage,
      instanceType,
    });
  }
}
