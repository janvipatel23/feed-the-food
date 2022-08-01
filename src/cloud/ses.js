// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");

const awsConfig = {
  region: "us-west-2",
  accessKeyId: "",
  secretAccessKey: "",
};

const SES = new AWS.SES(awsConfig);

function invokeses(mail) {
  // Create sendEmail params
  var params = {
    Source: "patel.janvi23798@gmail.com",
    Destination: {
      ToAddresses: [mail],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Hello and Congratulations!",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1> Now you are verified on our platform!</h1>
                <img src= "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgwU1G5lroknKHSsvpDpMi1FyiguaMEvY74Q&usqp=CAU" alt="image"/>`,
        },
      },
    },
  };

  // Create the promise and SES service object
  var sendPromise = SES.sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise
    .then(function (data) {
      console.log(data.MessageId);
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
}

exports.invokeses = invokeses;
