"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const memory_cache_1 = __importDefault(require("./memory_cache"));
require("dotenv").config();
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
});
const messagesCache = new memory_cache_1.default(60 * 5); // 5 min cache
const TABLE_NAME = "PratarnMessagesObjectsTest";
exports.insertMessageObject = (messageObject) => {
    const documentClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
    const params = {
        TableName: TABLE_NAME,
        Item: messageObject
    };
    return documentClient.put(params).promise();
};
exports.insertMessageObjects = (messageObjects) => {
    const documentClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
    const params = {
        RequestItems: {
            [TABLE_NAME]: messageObjects.map((messageObject) => ({
                PutRequest: { Item: messageObject }
            }))
        }
    };
    return documentClient.batchWrite(params).promise();
};
exports.fetchMessageObjects = (username) => __awaiter(this, void 0, void 0, function* () {
    const documentClient = new aws_sdk_1.default.DynamoDB.DocumentClient();
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "author_username = :author_username",
        ExpressionAttributeValues: { ":author_username": username }
    };
    const response = yield documentClient.query(params).promise();
    return {
        count: response.Count,
        messageObjects: response.Items
    };
});
exports.fetchMessageObjectsCached = (username) => __awaiter(this, void 0, void 0, function* () {
    return messagesCache.get(username, () => exports.fetchMessageObjects(username));
});
