import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StaticSite } from './constructs/static-site';

export class GithubActionObsOverlayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new StaticSite(this, 'GithubActionObsStaticSite', {
      domainName: 'lyraddigital.com',
      siteSubDomain: 'github-action-obs-dev'
    });
  }
}
