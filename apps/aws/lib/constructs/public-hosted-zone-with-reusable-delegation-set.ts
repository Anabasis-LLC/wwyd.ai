// 3rd party
import {
  Stack,
  Fn,
  Resource,
  aws_route53 as route53,
  aws_iam as iam,
  custom_resources,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Names } from 'aws-cdk-lib';

export interface PublicHostedZoneWithReusableDelegationSetProps
  extends route53.PublicHostedZoneProps {
  delegationSetId: string;
}

// https://pablissimo.com/1100/creating-a-route-53-public-hosted-zone-with-a-reusable-delegation-set-id-in-cdk
export class PublicHostedZoneWithReusableDelegationSet extends Resource {
  publicHostedZoneCustomResource: custom_resources.AwsCustomResource;
  publicHostedZone: route53.IPublicHostedZone;
  hostedZoneId: string;
  zoneName: string;
  hostedZoneNameServers?: string[];
  crossAccountZoneDelegationRole?: iam.Role;

  constructor(
    scope: Construct,
    id: string,
    props: PublicHostedZoneWithReusableDelegationSetProps,
  ) {
    super(scope, id);

    this.zoneName = props.zoneName;

    this.publicHostedZoneCustomResource =
      new custom_resources.AwsCustomResource(this, 'CreatePublicHostedZone', {
        onCreate: {
          service: 'Route53',
          action: 'createHostedZone',
          parameters: {
            CallerReference: Names.uniqueId(this), // Must be unique and 32 chars or less.
            Name: this.zoneName,
            DelegationSetId: props.delegationSetId.split('/').slice(-1)[0],
            HostedZoneConfig: {
              Comment: props.comment,
              PrivateZone: false,
            },
          },
          physicalResourceId:
            custom_resources.PhysicalResourceId.fromResponse('HostedZone.Id'),
        },
        onUpdate: {
          service: 'Route53',
          action: 'getHostedZone',
          parameters: {
            Id: new custom_resources.PhysicalResourceIdReference(),
          },
          physicalResourceId:
            custom_resources.PhysicalResourceId.fromResponse('HostedZone.Id'),
        },
        onDelete: {
          service: 'Route53',
          action: 'deleteHostedZone',
          parameters: {
            Id: new custom_resources.PhysicalResourceIdReference(),
          },
        },
        policy: custom_resources.AwsCustomResourcePolicy.fromSdkCalls({
          resources: custom_resources.AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      });

    const segments = Fn.split(
      '/',
      this.publicHostedZoneCustomResource.getResponseField('HostedZone.Id'),
    );

    this.hostedZoneId = Fn.select(2, segments);

    this.hostedZoneNameServers = [
      this.publicHostedZoneCustomResource.getResponseField(
        'DelegationSet.NameServers.0',
      ),
      this.publicHostedZoneCustomResource.getResponseField(
        'DelegationSet.NameServers.1',
      ),
      this.publicHostedZoneCustomResource.getResponseField(
        'DelegationSet.NameServers.2',
      ),
      this.publicHostedZoneCustomResource.getResponseField(
        'DelegationSet.NameServers.3',
      ),
    ];

    if (props.caaAmazon) {
      new route53.CaaAmazonRecord(this, 'CaaAmazon', { zone: this });
    }

    this.publicHostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(
      this,
      'CreatedPublicHostedZone',
      {
        hostedZoneId: this.hostedZoneId,
        zoneName: this.zoneName,
      },
    );
  }

  public get hostedZoneArn(): string {
    return Stack.of(this).formatArn({
      // Note: Because hosted zones are global, we need to manually clear
      // account and region values
      account: '',
      region: '',
      service: 'route53',
      resource: 'hostedzone',
      resourceName: this.hostedZoneId,
    });
  }

  public grantDelegation(grantee: iam.IGrantable): iam.Grant {
    return this.publicHostedZone.grantDelegation(grantee);
  }
}
