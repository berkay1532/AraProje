const AWS = require("aws-sdk");
const config = require("config");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  region: config.get("aws.region"),
  accessKeyId: config.get("aws.access_key_id"),
  secretAccessKey: config.get("aws.secret_access_key"),
});
const docClient = new AWS.DynamoDB.DocumentClient();

exports.createCompany = async (name, city, county, type, route) => {
  const params = {
    TableName: "Company",
    Item: {
      // _id: uuidv4(),
      name,
      city,
      county,
      type,
      route,
    },
  };

  try {
    await docClient.put(params).promise();
    console.log("Şirket başarıyla oluşturuldu");
  } catch (error) {
    console.error("Şirket oluşturulurken hata oluştu:", error);
  }
};

exports.getCompanyByName = async (companyName) => {
  const params = {
    TableName: "Company",
    Key: {
      name: companyName,
    },
  };

  try {
    const data = await docClient.get(params).promise();
    return data.Item;
  } catch (error) {
    console.error("Şirket getirilirken hata oluştu:", error);
    return null;
  }
};

exports.updateCompany = async (companyName, updateData) => {
  const params = {
    TableName: "Company",
    Key: {
      name: companyName,
    },
    UpdateExpression:
      "set #name = :name, city = :city, county = :county, #type = :type, route = :route",
    ExpressionAttributeNames: {
      "#name": "name",
      "#type": "type",
    },
    ExpressionAttributeValues: {
      ":name": updateData.name,
      ":city": updateData.city,
      ":county": updateData.county,
      ":type": updateData.type,
      ":route": updateData.route,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await docClient.update(params).promise();
    return data.Attributes;
  } catch (error) {
    console.error("Şirket güncellenirken hata oluştu:", error);
    return null;
  }
};

exports.deleteCompany = async (companyName) => {
  const params = {
    TableName: "Company",
    Key: {
      name: companyName,
    },
  };

  try {
    await docClient.delete(params).promise();
    console.log("Şirket başarıyla silindi");
  } catch (error) {
    console.error("Şirket silinirken hata oluştu:", error);
  }
};
