var { client, createDatabase } = require('./aws-client');
const TABLE_NAME =  "golf_tokens";


/**
 * add a new file.
 * 
 * @param user 
 * @returns 
 */
 function add(tokenData) {  

    if (!tokenData.email){
        throw "Email required for adding token";
    }

    if (!tokenData.token){
        throw "Token required for adding token";
    }     

    const params = {
        TableName: TABLE_NAME,
        Item: tokenData
    }
    
    return client.put(params).promise();
}


/**
 * add a new file.
 * 
 * @param user 
 * @returns 
 */
 function validateToken(email, token) {  
    
    let tokenData = get(token);

    if (!tokenData || tokenData.email.toUpperCase() !== email.toUpperCase()) {
        return false;
    }

    return true;
}


function get(token) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            'token': `${token}`
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
        { AttributeName: "token", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "token", AttributeType: "S" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
});

const exportedObject = {
    get,
    validateToken,
    add
};

// Export default
module.exports = exportedObject;