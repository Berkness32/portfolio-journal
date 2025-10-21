import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-west-2";
const TABLE  = process.env.DDB_TABLE || "journal";

const client = new DynamoDBClient({ region: REGION });
const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export async function POST(req) {
  try {
    const body = await req.json();
    const title = (body.title || "").trim();
    const date = body.date;
    const tag = body.tag;
    const link = body.link?.trim() || undefined;
    const description = (body.description || "").trim();

    if (!title || !date || !tag) {
      return NextResponse.json({ error: "Missing title, date, or tag" }, { status: 400 });
    }

    const id = randomUUID();

    await ddb.send(new PutCommand({
      TableName: TABLE,
      Item: { id, title, date, tag, link, description },
    }));

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
