// app/api/posts/[id]/route.js
import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-west-2";
const TABLE  = process.env.DDB_TABLE || "journal";

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

// GET /api/posts/[id]
export async function GET(_req, { params }) {
  const { id } = params;

  try {
    const { Item } = await ddb.send(
      new GetCommand({
        TableName: TABLE,
        Key: { id },           // assumes "id" is the table's partition key
      })
    );

    if (!Item) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(Item);
  } catch (err) {
    console.error(`GET /api/posts/${id} error:`, err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id]
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const body = await req.json();

    const title = (body.title || "").trim();
    const date = body.date;
    const tag = body.tag;
    const link = body.link?.trim() || undefined;
    const description = (body.description || "").trim();

    if (!title || !date || !tag) {
      return NextResponse.json(
        { error: "Missing title, date, or tag" },
        { status: 400 }
      );
    }

    const cmd = new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression: `
        SET #title = :title,
            #date = :date,
            #tag = :tag,
            #link = :link,
            #description = :description
      `,
      ExpressionAttributeNames: {
        "#title": "title",
        "#date": "date",
        "#tag": "tag",
        "#link": "link",
        "#description": "description",
      },
      ExpressionAttributeValues: {
        ":title": title,
        ":date": date,
        ":tag": tag,
        ":link": link,
        ":description": description,
      },
      // 🔐 IMPORTANT: do *not* create a new item if it doesn't exist
      ConditionExpression: "attribute_exists(id)",
      ReturnValues: "ALL_NEW",
    });

    const { Attributes } = await ddb.send(cmd);

    return NextResponse.json(Attributes);
  } catch (err) {
    // If the item didn't exist, DynamoDB throws ConditionalCheckFailedException
    if (err.name === "ConditionalCheckFailedException") {
      console.error(`PUT /api/posts/${id} – item does not exist`);
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    console.error(`PUT /api/posts/${id} error:`, err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
