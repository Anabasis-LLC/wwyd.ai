---
description: Bootstrap a complex AWS production environment using CDK.
---

# 🧊 AWS CDK

{% hint style="info" %}
The AWS production environment has already been bootstrapped using these instructions. It is documented here for posterity. Skip ahead to [deployment](deployment.md) if you're just interested in how to deploy services.
{% endhint %}

### Contents

- [Overview](aws-cdk.md#overview)
- [Bootstrapping](aws-cdk.md#bootstrapping)
  - [Create AWS Accounts](aws-cdk.md#create-aws-accounts)
  - [Configure Initial Credentials](aws-cdk.md#create-aws-accounts)
  - [Initialize CDK Project](aws-cdk.md#initialize-cdk-project)
  - [Bootstrap CDK](aws-cdk.md#bootstrap-cdk)
  - [Initial Deploy - OrgStack](aws-cdk.md#initial-deploy-orgstack)
  - [Initial Deploy - InfraStack](aws-cdk.md#initial-deploy-infrastack)

### Overview

Most infrastructure is hosted on AWS, which is configured according to the [multi-account environment best practices](https://aws.amazon.com/organizations/getting-started/best-practices/). The infrastructure is managed in code using [CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html).

### Bootstrapping

#### Create AWS Accounts

While signed in as root for the Anabasis Labs AWS account (428054769846), navigate to [AWS Organizations](https://us-east-1.console.aws.amazon.com/organizations/v2/home/root), create a new Organizational Unit with the name "WWYD" by navigating to "Actions" > "Create new".

In [AWS Accounts](https://us-east-1.console.aws.amazon.com/organizations/v2/home/accounts) create a new account by clicking "Add an AWS account".

You'll create two accounts:

- **WWYD Organization** (wwyd.organization@anabasis.dev)
- **WWYD Production** (wwyd.production@anabasis.dev)

After the accounts are created move them to the "WWYD" organizational unit by selecting them, clicking "Actions" > "Move", and selecting the "WWYD" folder.

For initial access to these AWS accounts you'll need to be able to receive emails to the addresses specified. You can add "alternate email" aliases for yourself in the [Google Workspace Admin Console](https://admin.google.com).

#### Configure Initial Credentials

After your email aliases are configured, sign out of the AWS console, and sign back in to the "Organization" account as root (using wwyd.organization@anabasis.dev). Instead of specifying a password click the "Forgot password?" link and set a password using the link from your inbox. Make sure you save this to 1Password.

Using your new password, sign in to "WWYD Organization" as root and create temporary security credentials [here](https://us-east-1.console.aws.amazon.com/iamv2/home#/security_credentials). Navigate to "Access keys" > "Create access key" to create new credentials.

Store these credentials in 1Password for now, but we'll delete them after we provision IAM users.

As an added security measure you should also enable MFA on this root account [here](https://us-east-1.console.aws.amazon.com/iamv2/home?region=us-east-1#/security_credentials/mfa). Choose the "Authenticator app" option and scan the QR code using 1Password.

Repeat this step for the "Production" account (using wwyd.production@anabasis.dev).

#### Initialize CDK Project

Initialize a new CDK project:

```bash
mkdir $REPO_HOME/apps/aws
cd $REPO_HOME/apps/aws
yarn cdk init app --language typescript
```

Convert the created package.json to a yarn monorepo workspace by adding or replacing the following in [apps/aws/package.json](../apps/aws/package.json):

```json
{
  "name": "@wwyd/aws",
  "private": true
}
```

#### Bootstrap CDK

Bootstrapping is the process of provisioning resources for the AWS CDK before you can deploy AWS CDK apps into an AWS environment. These resources include an Amazon S3 bucket for storing files and IAM roles that grant permissions needed to perform deployments. The required resources are defined in an AWS CloudFormation stack, called the bootstrap stack, which is usually named CDKToolkit. Like any AWS CloudFormation stack, it appears in the AWS CloudFormation console once it has been deployed.

If you attempt to deploy an AWS CDK application into an environment that doesn't have the necessary resources, an error message reminds you to bootstrap the environment.

Configure access to the "Organization" account and retrieve its id:

```bash
aws configure # Use the credentials from 1Password for "root @ WWYD Organization".
ORGANIZATION_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
echo $ORGANIZATION_ACCOUNT_ID
```

Run the CDK bootstrap command:

```bash
yarn cdk bootstrap aws://$ORGANIZATION_ACCOUNT_ID/us-west-1
```

Configure access to the "Production" account and retrieve its id:

```bash
aws configure # Use the credentials from 1Password for "root @ WWYD Production".
PRODUCTION_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
echo $PRODUCTION_ACCOUNT_ID
```

Run the cdk bootstrap command:

```bash
yarn cdk bootstrap aws://$PRODUCTION_ACCOUNT_ID/us-west-1 \
  --trust $ORGANIZATION_ACCOUNT_ID \
  --trust-for-lookup $ORGANIZATION_ACCOUNT_ID \
  --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess'
```

Notice the extra flags used for bootstrapping the "Production" account:

- `--trust` lists the AWS accounts that may deploy into the environment being bootstrapped.
- `--trust-for-lookup` lists the AWS accounts that may look up context information from the environment being bootstrapped.
- `--cloudformation-execution-policies` specifies the ARNs of managed policies that should be attached to the deployment role assumed by AWS CloudFormation during deployment of your stacks. By default, stacks are deployed with full administrator permissions using the AdministratorAccess policy. Note that we're not deviating from the default, but the flag is required when using `--trust` so it can't be omitted.

In effect this grants the "Organization" account permission to deploy to the "Production" account. Since our infrastructure will consist of resources that span our different accounts we need a single account to have permissions to deploy everywhere.

#### Initial Deploy - OrgStack

Switch back to the "Organization" account:

```sh
aws configure # Use the credentials from 1Password for "root @ WWYD Organization".
aws sts get-caller-identity # Ensure the account is the same as $ORGANIZATION_ACCOUNT_ID.
```

Deploy the `OrgStack`:

```sh
yarn cdk ls # Ensure `OrgStack` is present.
yarn cdk deploy OrgStack
```

This first deploy mostly deals with IAM - in particular it creates roles, groups and users.

You can verify that the users specified in [apps/aws/lib/constants.ts](../apps/aws/lib/constants.ts#L52) were created:

```sh
aws iam list-users
```

For each created user we should create a corresponding entry in 1Password and add their password and AWS credentials.

You can retrieve a user's password and credentials with:

```sh
# Replace `cte` with any valid username.
USER=cte

# Retrieve cte's password:
aws secretsmanager get-secret-value \
  --secret-id $(aws secretsmanager list-secrets --query "SecretList[?Name=='$USER-Password'].ARN|[0]" --output text) \
  --query "SecretString" \
  --output text

# Retrieve cte's Access Key ID and Secret Accesss Key:
aws secretsmanager get-secret-value \
  --secret-id $(aws secretsmanager list-secrets --query "SecretList[?Name=='$USER-AccessKey'].ARN|[0]" --output text) \
  --query "SecretString" \
  --output text
# Sample output: {"accessKeyId":"...","secretAccessKey":"..."}
```

MFA should be enabled for each user:

```sh
SERIAL_NUMBER=$(aws iam create-virtual-mfa-device --virtual-mfa-device-name $USER --outfile $USER-qrcode.png --bootstrap-method QRCodePNG | jq -r .VirtualMFADevice.SerialNumber)
```

Open QR code PNG that was created, scan it in 1Password, and then copy two codes.

```sh
CODE1=[Copied from 1Password]
CODE2=[Copied from 1Password]
aws iam enable-mfa-device \
  --user-name $USER \
  --serial-number $SERIAL_NUMBER \
  --authentication-code1 $CODE1 \
  --authentication-code2 $CODE2
```

Note that since these virtual MFA devices are not being created in CDK they must be deleted if you wish the destroy the `OrgStack` via CDK.

Now that we have users we can deactivate and delete the access keys for our root users [here](https://us-east-1.console.aws.amazon.com/iamv2/home#/security_credentials). You'll need to do this for all of the accounts that we created above. Going forward AWS operations will be performed with your user assuming the necessary IAM role.

Make sure to replace the deleted credentials locally by running `aws configure` and specifying the credentials for your newly created user (which are now in 1Password).

Within the AWS Management Console it's useful to be able to quickly switch roles. You can set this up with the following:

- Sign in as your IAM user in the "Organization" account [here](https://wwyd-organization.signin.aws.amazon.com/console).
- Click the "{user} @ 0548-9126-4416" drop-down in the top right and then click "Switch role".
- Click the "Switch Role" button.
- Enter the account id, role name and an alias of your choice, for example:
  - Account: 054891264416, Role: Admin, Display Name: Admin @ WWYD Organization
  - Account: 162728859685, Role: Admin, Display Name: Admin @ WWYD Production \[NOTE: This won't work until the InfraStack is deployed below.]

To see the identity of the IAM user whose credentials are currently configured:

```bash
aws sts get-caller-identity
```

To assume the "Admin" role on the "Organization" and "Production" accounts you can use the profiles set up in [.aws/config](../.aws/config) by simply passing `--profile <name>` to any cli command:

```bash
aws sts get-caller-identity --profile org
aws sts get-caller-identity --profile prod
```

#### Initial Deploy - InfraStack

There are two resources that we need to manually provision before deploying our `InfraStack`:

- A [reusable delegation DMS server set](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html#route-53-concepts-reusable-delegation-set).
- An [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) secret to store "secret" ENV variables.

Part of the management of our domain name cannot be automated by CDK. In particular we need to manually change the nameservers at the domain registrar (in this case GoDaddy). By default, Route 53 assigns a random selection of name servers to each new hosted zone. To make it easier to migrate DNS service to Route 53 for a large number of domains, you can create a reusable delegation set and then associate the reusable delegation set with new hosted zones. We'll create a reusable delegation set and then switch our domain to use the delegation set's nameservers on GoDaddy.

We first need to provision the `AdminRole` for the `InfraStack` without provisioning anything else (the things that depend on the delegation set will fail). In the `InfraStack` definition comment everything out after the following:

```typescript
this.adminRole = new iam.Role(this, "AdminRole", {
  roleName: "Admin",
  assumedBy: new iam.PrincipalWithConditions(
    new iam.AccountPrincipal(ACCOUNTS.Organization.accountId),
    {}
  ),
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
  ],
});
```

Deploy the `InfraStack`:

```bash
yarn cdk ls # Ensure `InfraStack` is present.
yarn cdk deploy InfraStack
```

After deploying you can revert your changes. This step is annoying, and we can improve it later.

We can now create our reusable delegation set:

```bash
aws route53 create-reusable-delegation-set --caller-reference wwyd.ai --profile prod
```

This results in the following:

```json
{
  "DelegationSet": {
    "Id": "/delegationset/N03882533H4UYOYAOR10Z",
    "CallerReference": "wwyd.ai",
    "NameServers": [
      "ns-200.awsdns-25.com",
      "ns-1492.awsdns-58.org",
      "ns-1614.awsdns-09.co.uk",
      "ns-985.awsdns-59.net"
    ]
  }
}
```

Update the domain to use these nameservers [here](https://dcc.godaddy.com/control/wwyd.ai/dns) and change `DELEGATION_SET_ID` in [apps/aws/lib/constants.ts](../apps/aws/lib/constants.ts#L61) to the appropriate value.

If for some reason you need to change delegation sets in the future you can delete the set we just provisioned with the following:

```bash
aws route53 delete-reusable-delegation-set --id $(aws route53 list-reusable-delegation-sets --query "DelegationSets[0].Id" --output text --profile prod) --profile prod
```

In addition to the reusable delegation set, we need to manually provision an AWS SecretsManager secret to store some sensitive ENV variables:

```bash
aws secretsmanager create-secret --name ENV --profile prod
```

This results in the following:

```json
{
  "ARN": "arn:aws:secretsmanager:us-west-1:162728859685:secret:ENV-CMKOxV",
  "Name": "ENV"
}
```

Change `ENV_SECRETS_ARN` in [apps/aws/lib/constants.ts](../apps/aws/lib/constants.ts#L63) to this `ARN` value. It will be used by CDK to safely load our secret ENV variables and inject them into our application stacks.

We can now deploy the rest of the `InfraStack`:

```bash
yarn cdk deploy InfraStack
```

Now that our infra has been provisioned we need update our application's production ENV variables to correctly point at these resources.

Database host and credentials:

```bash
SECRET_ID=$(aws secretsmanager list-secrets --query "SecretList[?Name=='PostgresClusterCredentials'].ARN|[0]" --output text --profile prod)
SECRET=$(aws secretsmanager get-secret-value --secret-id $SECRET_ID --query "SecretString" --output text --profile prod)
DB_ENGINE=$(echo $SECRET | jq -r ".engine")
DB_USER=$(echo $SECRET | jq -r ".username")
DB_PASS=$(echo $SECRET | jq -r ".password")
DB_HOST=$(echo $SECRET | jq -r ".host")
DB_PORT=$(echo $SECRET | jq -r ".port")
echo "export PRODUCTION_DATABASE_URL=$DB_ENGINE://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/wwyd_production" >> $REPO_HOME/.envrc.local
```

Read-only database role:

```sql
-- https://stackoverflow.com/a/42044878
CREATE ROLE reader WITH LOGIN PASSWORD 'c57749a49ac126c646e7' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION VALID UNTIL 'infinity';

-- Allow access to the `wwyd_production` database.
GRANT CONNECT ON DATABASE wwyd_production TO reader;

-- Allows role to access and use objects within the schema, but not the ability
-- to create, modify, or delete objects within the schema.
GRANT USAGE ON SCHEMA public TO reader;

-- Allow reads on all existing tables and sequences.
GRANT SELECT ON ALL TABLES IN SCHEMA public TO reader;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO reader;

-- Allow reads on all future tables and sequences.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO reader;

-- Revoke the create privilege on the public schema from the special PUBLIC role.
-- The PUBLIC role represents all users in the PostgreSQL database, so revoking
-- the create privilege from PUBLIC means that no users will be able to create
-- new objects within the public schema by default.
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
```

TODO: Replace `$PRODUCTION_DATABASE_URL` with the read-only role above, and add a new ENV variable for the owner role, which will be needed for migrations.

Redis host:

```bash
# If using cluster mode:
aws elasticache describe-replication-groups --query "ReplicationGroups[].NodeGroups[].PrimaryEndpoint" --profile prod

# Otherwise:
aws elasticache describe-cache-clusters --show-cache-node-info --query 'CacheClusters[].CacheNodes[].Endpoint' --profile prod
```

```json
[{ "Address": "wwyd.znsp43.0001.usw1.cache.amazonaws.com", "Port": 6379 }]
```

Use this to set `$PRODUCTION_REDIS_URL` in [.envrc](../.envrc).

CloudFront host:

```bash
aws cloudfront list-distributions --query "DistributionList.Items[].DomainName" --profile prod
```

```json
["d159rg6y18squf.cloudfront.net"]
```

Use this to set `$CDN_HOST` in [.envrc](../.envrc).
