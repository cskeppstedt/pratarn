import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  IFetchMessageObjectsResponse,
  IStorageMessageView,
  NormalizedUsername,
} from "../types";
import MemoryCache from "./memory_cache";

require("dotenv").config();

const documentClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: process.env.AWS_DEFAULT_REGION,
  })
);

const messagesCache = new MemoryCache(60 * 5); // 5 min cache

const TABLE_NAME = "PratarnMessagesObjectsTest";

export const insertMessageObject = (messageObject: IStorageMessageView) => {
  const params = {
    TableName: TABLE_NAME,
    Item: messageObject,
  };
  return documentClient.send(new PutCommand(params));
};

export const insertMessageObjects = (messageObjects: IStorageMessageView[]) => {
  const params = {
    RequestItems: {
      [TABLE_NAME]: messageObjects.map((messageObject) => ({
        PutRequest: { Item: messageObject },
      })),
    },
  };
  return documentClient.send(new BatchWriteCommand(params));
};

export const fetchMessageObjects = async (username: NormalizedUsername) => {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "author_username = :author_username",
    ExpressionAttributeValues: { ":author_username": username },
  };

  const response = await documentClient.send(new QueryCommand(params));
  return {
    count: response.Count as number,
    messageObjects: response.Items as IStorageMessageView[],
  } as IFetchMessageObjectsResponse;
};

export const fetchMessageObjectsCached = async (username: NormalizedUsername) =>
  messagesCache.get(username, () =>
    fetchMessageObjects(username)
  ) as Promise<IFetchMessageObjectsResponse>;
