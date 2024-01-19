import { aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export type SelfManagementPolicyProps = Omit<
  iam.ManagedPolicyProps,
  'document'
>;

export class SelfManagementPolicy extends iam.ManagedPolicy {
  constructor(
    scope: Construct,
    id: string,
    props: SelfManagementPolicyProps = {},
  ) {
    super(scope, id, {
      managedPolicyName: 'IAMSelfManagement',
      document: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'iam:GetAccountPasswordPolicy',
              'iam:GetAccountSummary',
              'iam:ListVirtualMFADevices',
            ],
            resources: ['*'],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['iam:ChangePassword', 'iam:GetUser'],
            resources: ['arn:aws:iam::*:user/${aws:username}'],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'iam:CreateAccessKey',
              'iam:DeleteAccessKey',
              'iam:ListAccessKeys',
              'iam:UpdateAccessKey',
            ],
            resources: ['arn:aws:iam::*:user/${aws:username}'],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'iam:DeleteSigningCertificate',
              'iam:ListSigningCertificates',
              'iam:UpdateSigningCertificate',
              'iam:UploadSigningCertificate',
            ],
            resources: ['arn:aws:iam::*:user/${aws:username}'],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'iam:DeleteSSHPublicKey',
              'iam:GetSSHPublicKey',
              'iam:ListSSHPublicKeys',
              'iam:UpdateSSHPublicKey',
              'iam:UploadSSHPublicKey',
            ],
            resources: ['arn:aws:iam::*:user/${aws:username}'],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'iam:CreateServiceSpecificCredential',
              'iam:DeleteServiceSpecificCredential',
              'iam:ListServiceSpecificCredentials',
              'iam:ResetServiceSpecificCredential',
              'iam:UpdateServiceSpecificCredential',
            ],
            resources: ['arn:aws:iam::*:user/${aws:username}'],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['iam:CreateVirtualMFADevice'],
            resources: ['arn:aws:iam::*:mfa/${aws:username}'],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              'iam:EnableMFADevice',
              'iam:ListMFADevices',
              'iam:ResyncMFADevice',
            ],
            resources: ['arn:aws:iam::*:user/${aws:username}'],
          }),
        ],
      }),
      ...props,
    });
  }
}
