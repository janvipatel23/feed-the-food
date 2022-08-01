var express = require("express");
var router = express.Router();
// Load the AWS SDK
var AWS = require("aws-sdk"),
  region = "us-west-2",
  secretName = "API_KEY",
  secret,
  decodedBinarySecret;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
  region: region,
  accessKeyId: "",
  secretAccessKey: "",
});

router.get("/", async function (req, res) {
  let result = await getSecretKeys("configuration");
  let response_key = result.split(":").pop().substring(1, 41);
  res.status(200).send(response_key);
});

async function getSecretKeys() {
  const ret = await client
    .getSecretValue({ SecretId: "API_KEY" }, function (err, data) {
      if (err) {
        let error_response = {
          statusCode: 400,
          body: JSON.stringify(err),
        };
        if (err.code === "DecryptionFailureException") throw err;
        else if (err.code === "InternalServiceErrorException") throw err;
        else if (err.code === "InvalidParameterException") throw err;
        else if (err.code === "InvalidRequestException") throw err;
        else if (err.code === "ResourceNotFoundException") throw err;
      } else {
        // Decrypts secret using the associated KMS key.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ("SecretString" in data) {
          secret = data.SecretString;
        } else {
          let buff = new Buffer(data.SecretBinary, "base64");
          decodedBinarySecret = buff.toString("ascii");
        }
      }

      // Your code goes here.
    })
    .promise()
    .then((res) => {
      return secret;
    });

  return ret;
}

module.exports = router;
