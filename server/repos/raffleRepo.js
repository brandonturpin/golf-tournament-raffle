var { client, createDatabase } = require('./aws-client');
const { v4: uuidv4 } = require('uuid');
const TABLE_NAME =  "golf_raffles";


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
 * @param raffleItem 
 * @returns 
 */
 function add(raffleItem) {
    raffleItem.id = uuidv4();    
    return update(raffleItem);
}

/**
 * Update the raffle item.
 * 
 * @param raffleItem 
 * @returns 
 */
 function update(raffleItem) {

    if(!raffleItem.bids){
        raffleItem.bids = [];
    }

    const params = {
        TableName: TABLE_NAME,
        Item: raffleItem
    }
    
    return client.put(params).promise();
}

function get(id) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            'id': `${id}`
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
        { AttributeName: "id", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "id", AttributeType: "S" },
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