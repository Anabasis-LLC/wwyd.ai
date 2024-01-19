// 3rd party
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
import { S3Client } from '@aws-sdk/client-s3';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';

/**
 * getCredentials
 *
 * TODO: Cache this for some period of time.
 */

export const getCredentialProvider = async () => {
  const credentialsRelativeUri =
    process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI || '';

  // https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html
  //
  // Example:
  // /v2/credentials/4a3195ce-5b89-4a3f-b7c7-8076e10e4f63
  if (credentialsRelativeUri.startsWith('/')) {
    return async () => {
      const url = `http://169.254.170.2${credentialsRelativeUri}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
      }

      const payload = await response.json();

      return {
        accessKeyId: payload.AccessKeyId,
        secretAccessKey: payload.SecretAccessKey,
        sessionToken: payload.Token,
        expiration: new Date(payload.Expiration),
      };
    };
  } else {
    return fromTemporaryCredentials({
      params: {
        RoleArn: 'arn:aws:iam::162728859685:role/Admin',
        RoleSessionName: 'web',
      },
    });
  }
};

/**
 * getStsClient
 */

export const getStsClient = async () =>
  new STSClient({
    credentials: await getCredentialProvider(),
  });

/**
 * getS3Client
 */

export const getS3Client = async () =>
  new S3Client({
    credentials: await getCredentialProvider(),
  });

/**
 * getCallerIdentity
 */

export const getCallerIdentity = async () =>
  (await getStsClient()).send(new GetCallerIdentityCommand({}));
