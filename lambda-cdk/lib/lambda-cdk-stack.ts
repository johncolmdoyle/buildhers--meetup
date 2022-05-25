import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-lambda-event-sources';
import * as path from 'path';

export class LambdaCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const inputGlobalTable = new dynamodb.Table(this, 'inputGlobalTable', {
      tableName: 'ExampleIn',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      replicationRegions: ['us-east-1', 'us-east-2', 'us-west-2'],
    });

    const outputGlobalTable = new dynamodb.Table(this, 'outputGlobalTable', {
      tableName: 'ExampleOut',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      replicationRegions: ['us-east-1', 'us-east-2', 'us-west-2'],
    });

    // Create the Function
    const fn = new lambda.Function(this, 'ProcessingFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      environment: {
        TABLE: outputGlobalTable.tableName
      }
    });

    // Grant write access
    outputGlobalTable.grantWriteData(fn);
    inputGlobalTable.grantStreamRead(fn);

    // Add the dynamodb stream
    fn.addEventSource(
      new events.DynamoEventSource(inputGlobalTable, {
        startingPosition: lambda.StartingPosition.TRIM_HORIZON,
        batchSize: 5
      }));
  }
}
