import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class DynamodbCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const globalTable = new dynamodb.Table(this, 'GlobalTable', {
      tableName: 'Example',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      replicationRegions: ['us-east-1', 'us-east-2', 'us-west-2'],
    });
  }
}
