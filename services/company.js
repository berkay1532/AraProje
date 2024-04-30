const AWS = require("aws-sdk");
const config = require("config");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { JSDOM } = require("jsdom");

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
      "set #city = :city, county = :county, #type = :type, route = :route, deneme = :deneme",
    ExpressionAttributeNames: {
      "#city": "city",
      "#type": "type",
    },
    ExpressionAttributeValues: {
      ":name": updateData.name,
      ":city": updateData.city,
      ":county": updateData.county,
      ":type": updateData.type,
      ":route": updateData.route,
      ":deneme": "deneme",
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

exports.getExtraDetailsForCompany = async (companyName) => {
  try {
    // HTTP GET isteği atılıyor
    const response = await axios.get(
      `https://api.lix-it.com/v1/li/linkedin/search/orgs?url=https%3A%2F%2Fwww.linkedin.com%2Fsearch%2Fresults%2Fcompanies%2F%3Fkeywords%3D${companyName}%26origin%3DSWITCH_SEARCH_VERTICAL%26sid%3Do(E`,
      {
        headers: {
          Authorization: config.get("lix.api_key"), // Burada gerekli olan yetkilendirme token'ınızı ekleyin
        },
      }
    );
    const org_link = response.data.orgs[0].link || "";
    // İstek başarılı ise, yanıtın içeriğini döndür

    // HTTP GET isteği atılıyor
    const response2 = await axios.get(
      `https://api.lix-it.com/v1/organisations/by-linkedin?linkedin_url=${org_link}`,
      {
        headers: {
          Authorization: config.get("lix.api_key"), // Burada gerekli olan yetkilendirme token'ınızı ekleyin
        },
      }
    );

    return response2.data;
  } catch (error) {
    console.log({ error });
    return {};
  }
};

exports.updateCompanyWithExtraDetails = async (companyName, updateData) => {
  const params = {
    TableName: "Company",
    Key: {
      name: companyName,
    },
    UpdateExpression:
      "set companyType = :companyType, description = :description, followers = :followers, " +
      "headquarters = :headquarters, industry = :industry, initialRequestLiId = :initialRequestLiId, " +
      "liEmployeeCount = :liEmployeeCount, link = :link, logoUrl = :logoUrl, " +
      "salesNavLink = :salesNavLink, size = :size, website = :website, yearFounded = :yearFounded",
    ExpressionAttributeValues: {
      ":companyType": updateData.companyType || " ",
      ":description": updateData.description || " ",
      ":followers": updateData.followers || " ",
      ":headquarters": updateData.headquarters || " ",
      ":industry": updateData.industry || " ",
      ":initialRequestLiId": updateData.initialRequestLiId || " ",
      ":liEmployeeCount": updateData.liEmployeeCount || " ",
      ":link": updateData.link || " ",
      ":logoUrl": updateData.logoUrl || " ",
      ":salesNavLink": updateData.salesNavLink || " ",
      ":size": updateData.size || " ",
      ":website": updateData.website || " ",
      ":yearFounded": updateData.yearFounded || " ",
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

exports.fetchJobs = async () => {
  fetch(
    "https://www.linkedin.com/jobs/primacy-jobs-worldwide?f_C=2634417&position=1&pageNum=0"
  )
    .then((response) => response.text())
    .then((html) => {
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      const jobListings = doc.querySelectorAll(
        '[data-impression-id^="organization_guest-browse_jobs"]'
      );
      jobListings.forEach((job) => console.log(job.textContent.trim())); // İş ilanlarının detaylarını konsola yazdır
    })
    .catch((error) => console.error("Error fetching the data:", error));
};
