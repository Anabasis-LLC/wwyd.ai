// 3rd party
import { Stack, StackProps, aws_iam as iam } from 'aws-cdk-lib';
import { Construct } from 'constructs';

// lib
import { ACCOUNTS, GROUPS, USERS } from '../constants';
import { SelfManagementPolicy } from '../constructs/self-management-policy';
import { ManagedUser } from '../constructs/managed-user';

export class OrgStack extends Stack {
  selfManagementPolicy: iam.ManagedPolicy;
  assumeAllRolesPolicy: iam.ManagedPolicy;
  adminRole: iam.Role;
  adminGroup: iam.Group;
  developerGroup: iam.Group;
  managedUsers: ManagedUser[];

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * Policies
     */

    this.selfManagementPolicy = new SelfManagementPolicy(
      this,
      'IAMSelfManagementPolicy',
    );

    this.assumeAllRolesPolicy = new iam.ManagedPolicy(
      this,
      'IAMAssumeAllRoles',
      {
        managedPolicyName: 'IAMAssumeAllRoles',
        document: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['sts:AssumeRole'],
              resources: ['*'],
            }),
          ],
        }),
      },
    );

    /**
     * Roles
     */

    this.adminRole = new iam.Role(this, 'AdminRole', {
      roleName: 'Admin',
      assumedBy: new iam.PrincipalWithConditions(
        new iam.AccountPrincipal(ACCOUNTS.Organization.accountId),
        {},
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      ],
    });

    /**
     * Groups
     */

    this.adminGroup = new iam.Group(this, 'AdminGroup', {
      groupName: GROUPS.Admins.name,
      managedPolicies: [this.selfManagementPolicy, this.assumeAllRolesPolicy],
    });

    this.developerGroup = new iam.Group(this, 'DeveloperGroup', {
      groupName: GROUPS.Developers.name,
      managedPolicies: [
        this.selfManagementPolicy,
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonEC2ContainerRegistryPowerUser',
        ),
      ],
    });

    // this.developerGroup.attachInlinePolicy(...)

    /**
     * Users
     */

    this.managedUsers = USERS.map(({ userName, groups }) => {
      const managed = new ManagedUser(this, `User-${userName}`, { userName });

      if (groups.has(GROUPS.Admins.name)) {
        managed.user.addToGroup(this.adminGroup);
      }

      if (groups.has(GROUPS.Developers.name)) {
        managed.user.addToGroup(this.developerGroup);
      }

      return managed;
    });
  }
}
