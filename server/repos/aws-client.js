var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

const dynamodb = new AWS.DynamoDB();

const client = new AWS.DynamoDB.DocumentClient();

function createDatabase (params) {
    dynamodb.createTable(params, (error, data) => {
        if (error) {
            console.error(error);
        }
    });
}

const exportedObject = {
    client,
    createDatabase
};

// Export default
module.exports = exportedObject;