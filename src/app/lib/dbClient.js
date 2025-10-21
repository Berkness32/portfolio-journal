import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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
