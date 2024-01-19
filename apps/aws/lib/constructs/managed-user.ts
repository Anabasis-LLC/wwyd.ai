// 3rd party
import {
  aws_iam as iam,
  aws_secretsmanager as secretsmanager,
} from 'aws-cdk-lib';
import { ManagedAccessKey } from './managed-access-key';
import { Construct } from 'constructs';

export interface ManagedUserProps
  extends Omit<iam.UserProps, 'userName' | 'password'> {
  userName: string;
  inlinePolicies?: Record<string, iam.PolicyDocument>;
}

export class ManagedUser extends Construct {
  passwordSecret: secretsmanager.Secret;
  accessKeySecret: secretsmanager.CfnSecret;
  accessKey: iam.CfnAccessKey;
  user: iam.User;

  constructor(
    scope: Construct,
    id: string,
    { userName, inlinePolicies = {}, ...props }: ManagedUserProps,
  ) {
    super(scope, id);

    this.passwordSecret = new secretsmanager.Secret(this, 'PasswordSecret', {
      secretName: `${userName}-Password`,
      generateSecretString: { passwordLength: 32 },
    });

    this.user = new iam.User(this, 'User', {
      userName,
      password: this.passwordSecret.secretValue,
      ...props,
    });

    const { secret: accessKeySecret, accessKey } = new ManagedAccessKey(
      this,
      'ManagedAccessKey',
      { user: this.user },
    );

    this.accessKeySecret = accessKeySecret;
    this.accessKey = accessKey;

    Object.entries(inlinePolicies).forEach(([name, document]) =>
      this.user.attachInlinePolicy(new iam.Policy(this, name, { document })),
    );
  }
}
