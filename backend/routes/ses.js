const AWS = require("aws-sdk");
const router = require("express").Router();

AWS.config.update({
  accessKeyId: "",
  secretAccessKey: "",
  region: "us-east-1",
});

let SES = new AWS.SES();

router.get("/", (req, res) => {
  const params = {
    EmailAddress: "maanmandaliya9.mm@gmail.com",
  };

  SES.verifyEmailAddress(params, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

module.exports = router;
