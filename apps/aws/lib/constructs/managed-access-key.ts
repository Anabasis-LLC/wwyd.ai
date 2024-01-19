// 3rd party
import {
  aws_iam as iam,
  aws_secretsmanager as secretsmanager,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface ManagedAccessKeyProps {
  user: iam.User;
}

export class ManagedAccessKey extends Construct {
  secret: secretsmanager.CfnSecret;
  accessKey: iam.CfnAccessKey;

  constructor(scope: Construct, id: string, { user }: ManagedAccessKeyProps) {
    super(scope, id);

    this.accessKey = new iam.CfnAccessKey(this, `AccessKey`, {
      userName: user.userName,
    });

    this.secret = new secretsmanager.CfnSecret(this, 'Secret', {
      name: `${user.userName}-AccessKey`,
      secretString: JSON.stringify({
        accessKeyId: this.accessKey.ref,
        secretAccessKey: this.accessKey.attrSecretAccessKey,
      }),
    });

    this.accessKey.node.addDependency(user);
    this.secret.node.addDependency(this.accessKey);
  }
}
