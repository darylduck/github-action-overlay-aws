#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { GithubActionObsOverlayStack } from '../lib/github-action-obs-overlay-stack';

const app = new cdk.App();
new GithubActionObsOverlayStack(app, 'GithubActionObsOverlayStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});