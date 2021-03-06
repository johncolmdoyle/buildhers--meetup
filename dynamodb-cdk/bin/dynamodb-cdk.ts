#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DynamodbCdkStack } from '../lib/dynamodb-cdk-stack';

const app = new cdk.App();
new DynamodbCdkStack(app, 'DynamodbCdkStack', {});
