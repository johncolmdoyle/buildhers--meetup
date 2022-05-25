// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async function(event) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  let sourceId = event.Records[0].dynamodb.Keys.id.S;
  let sourceRegion = event.Records[0].awsRegion;

  const tableName = process.env.TABLE;
  const region = process.env.AWS_REGION;

  var params = {
    TableName: tableName,
    Item: {
      'id' : AWS.util.uuid.v4(),
      'region' : region,
      'sourceId': sourceId,
      'sourceRegion': sourceRegion
    }
  };

  // Call DynamoDB to add the item to the table
  await docClient.put(params).promise();
};

