const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  accessKeyId: "",
  secretAccessKey: "",
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "ngo";
const DONOR_TABLE_NAME = "donor";

export const getCharacters = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const characters = await dynamoClient.scan(params).promise();
  return characters;
};

export const addOrUpdateCharacter = async (character) => {
  const params = {
    TableName: TABLE_NAME,
    Item: character,
  };
  return await dynamoClient.put(params).promise();
};

export const getIfRegistered = async () => {
  const params = {
    TableName: "regNumbers",
  };
  const list = await dynamoClient.scan(params).promise();
  return list.Items;
};

export const addDonor = async (donor) => {
  const params = {
    TableName: DONOR_TABLE_NAME,
    Item: donor,
  };
  return dynamoClient.put(params).promise();
};

export const getDonor = (username) => {
  const params = {
    TableName: DONOR_TABLE_NAME,
    Key: { username: username },
  };
  return dynamoClient
    .get(params)
    .promise()
    .then((res) => res.Item);
};
