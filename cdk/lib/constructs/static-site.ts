import { Aws, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { 
    CloudFrontAllowedMethods, CloudFrontWebDistribution, OriginAccessIdentity, 
    SSLMethod, SecurityPolicyProtocol, ViewerCertificate
} from 'aws-cdk-lib/aws-cloudfront';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export interface StaticSiteProps {
    domainName: string;
    siteSubDomain: string;
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class StaticSite extends Construct {
    constructor(parent: Stack, name: string, props: StaticSiteProps) {
        super(parent, name);

        const zone = HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });
        const siteDomain = `${props.siteSubDomain}.${props.domainName}`;
        const cloudfrontOAI = new OriginAccessIdentity(this, 'cloudfront-OAI', {
            comment: `OAI for ${name}`
        });

        new CfnOutput(this, 'Site', { value: 'https://' + siteDomain });

        // Content bucket
        const siteBucket = new Bucket(this, 'SiteBucket', {
            bucketName: siteDomain,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            publicReadAccess: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });

        // Grant access to cloudfront
        siteBucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [siteBucket.arnForObjects('*')],
            principals: [new CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));

        new CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

        // TLS certificate
        const certificateArn = new DnsValidatedCertificate(this, 'SiteCertificate', {
            domainName: siteDomain,
            hostedZone: zone,
            region: 'us-east-1',
        }).certificateArn;
        
        new CfnOutput(this, 'Certificate', { value: certificateArn });

        // Specifies you want viewers to use HTTPS & TLS v1.1 to request your objects
        const viewerCertificate = ViewerCertificate.fromAcmCertificate({
            certificateArn: certificateArn,
            env: {
                region: Aws.REGION,
                account: Aws.ACCOUNT_ID
            },
            node: this.node,
            stack: parent
        },
            {
                sslMethod: SSLMethod.SNI,
                securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
                aliases: [siteDomain]
            })

        // CloudFront distribution
        const distribution = new CloudFrontWebDistribution(this, 'SiteDistribution', {
            viewerCertificate,
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: siteBucket,
                        originAccessIdentity: cloudfrontOAI
                    },
                    behaviors: [{
                        isDefaultBehavior: true,
                        compress: true,
                        allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
                    }],
                }
            ]
        });

        new CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

        // Route53 alias record for the CloudFront distribution
        new ARecord(this, 'SiteAliasRecord', {
            recordName: siteDomain,
            target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
            zone
        });

        // Deploy site contents to S3 bucket
        new BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [Source.asset('../react-app/build')],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'],
        });
    }
}