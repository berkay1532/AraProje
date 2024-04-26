const AWS = require("aws-sdk");
const config = require("config");

AWS.config.update({
  region: config.get("aws.region"),
  accessKeyId: config.get("aws.access_key_id"),
  secretAccessKey: config.get("aws.secret_access_key"),
});

const dynamodb = new AWS.DynamoDB();

exports.createTable = async (tableName) => {
  const params = {
    TableName: tableName,
    KeySchema: [{ AttributeName: "name", KeyType: "HASH" }], // Partition key
    AttributeDefinitions: [{ AttributeName: "name", AttributeType: "S" }], // 'S' for string
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    const data = await dynamodb.createTable(params).promise();
    console.log(
      "Tablo başarıyla oluşturuldu. Tablo açıklaması JSON:",
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    console.error(
      "Tablo oluşturulamadı. Hata JSON:",
      JSON.stringify(error, null, 2)
    );
  }
};
