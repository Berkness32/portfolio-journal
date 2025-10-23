import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Create DynamoDB client
const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);

// Function to add a post
export async function addPost(post) {
  const command = new PutCommand({
    TableName: "journal",
    Item: post,
  });
  await docClient.send(command);
}

export async function getRecentCloudPosts() {
  const command = new QueryCommand({
    TableName: "journal",
    KeyConditionExpression: "#tag = :tagValue",
    ExpressionAttributeNames: {
      "#tag": "tag",
    },
    ExpressionAttributeValues: {
      ":tagValue": "Cloud",
    },
    ScanIndexForward: false, // false = descending order (most recent first)
    Limit: 5,
  });

  const { Items } = await docClient.send(command);
  return Items;
}
