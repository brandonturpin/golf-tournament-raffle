var { client, createDatabase } = require('./aws-client');
const { v4: uuidv4 } = require('uuid');
const TABLE_NAME =  "golf_users";

/**
 * Fetch the json from the file.
 * 
 * @returns 
 */
 function getAll() {
    const run = async () => {
        const params = { TableName: TABLE_NAME };

        let response = {};
        let scanResults = [];

        do {
            response = await client.scan(params).promise();
            response.Items.forEach((item) => { scanResults.push(item) });
            params.ExclusiveStartKey = response.LastEvaluatedKey;
        } 
        while (typeof response.LastEvaluatedKey !== "undefined");

        return scanResults;
    }

    return new Promise(resolve => resolve(run()));
}

/**
 * add a new file.
 * 
 * @param user 
 * @returns 
 */
 function add(user) {  
    return update(user);
}

/**
 * Update the raffle item.
 * 
 * @param user 
 * @returns 
 */
 function update(user) {
    const params = {
        TableName: TABLE_NAME,
        Item: user
    }
    
    return client.put(params).promise();
}

function get(emailAddress) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            'emailAddress': `${emailAddress}`
        }
    }

    return new Promise((resolve) => {
        client.get(params).promise()
        .then((data) => {
            resolve(data.Item ? data.Item : null);
        });
    });
}

createDatabase({
    TableName : TABLE_NAME,
    KeySchema: [       
        { AttributeName: "emailAddress", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "emailAddress", AttributeType: "S" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
});

const exportedObject = {
    get,
    update,
    add,
    getAll
};

// Export default
module.exports = exportedObject;