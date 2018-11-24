import AWS, { AWSError } from "aws-sdk";
import {
  IFetchMessageObjectsResponse,
  IStorageMessageView,
  NormalizedUsername
} from "../types";
import MemoryCache from "./memory_cache";

require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION
});

const messagesCache = new MemoryCache(60 * 5); // 5 min cache

const TABLE_NAME = "PratarnMessagesObjectsTest";

export const insertMessageObject = (messageObject: IStorageMessageView) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: TABLE_NAME,
    Item: messageObject
  };
  return documentClient.put(params).promise();
};

export const insertMessageObjects = (messageObjects: IStorageMessageView[]) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    RequestItems: {
      [TABLE_NAME]: messageObjects.map((messageObject) => ({
        PutRequest: { Item: messageObject }
      }))
    }
  };
  return documentClient.batchWrite(params).promise();
};

export const fetchMessageObjects = async (username: NormalizedUsername) => {
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "author_username = :author_username",
    ExpressionAttributeValues: { ":author_username": username }
  };

  const response = await documentClient.query(params).promise();
  return {
    count: response.Count as number,
    messageObjects: response.Items as IStorageMessageView[]
  } as IFetchMessageObjectsResponse;
};

export const fetchMessageObjectsCached = async (
  username: NormalizedUsername
) => {
  return messagesCache.get(username, () =>
    fetchMessageObjects(username)
  ) as Promise<IFetchMessageObjectsResponse>;
};
