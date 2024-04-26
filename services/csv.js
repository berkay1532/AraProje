const https = require("https");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const logger = require("../utils/winstonLogger");

const companyService = require("./company");

// date should be like = 2024-04-15
exports.downloadCsv = async (date) => {
  logger.info(`Downloading CSV for date: ${date}`);

  const localFilePath = `./csv/${date}.csv`;
  const file = fs.createWriteStream(localFilePath);
  const fileUrl = `https://assets.publishing.service.gov.uk/media/661d02de08c3be25cfbd3db8/${date}_-_Worker_and_Temporary_Worker.csv`;
  https
    .get(fileUrl, (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        logger.info("Dosya indirme işlemi tamamlandı.");
        // Dosyayı işlemek için buraya kod ekleyebilirsiniz
      });
    })
    .on("error", (error) => {
      fs.unlink(localFilePath); // İndirme başarısız olursa, kısmi dosyayı sil
      console.error("Dosya indirilirken bir hata oluştu:", error.message);
    });
};

exports.deleteCsv = async () => {
  const directory = "csv";

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
  logger.info("Csv silme işlemi tamamlandı.");
};

exports.syncCsvToDatabase = async (date) => {
  const results = [];
  // __dirname, mevcut dosyanın bulunduğu dizini referans alır.
  // 'csv' klasörünün, bu dosya ile aynı dizinde olduğunu varsayıyoruz.
  const csvFilePath = path.join(__dirname, "../", "csv", `${date}.csv`);

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        // Promise'in çözülmesini burada bekleyeceğiz
        try {
          if (results.length != 0) {
            for (let each of results) {
              console.log(each);
              await companyService.createCompany(
                each["Organisation Name"],
                each["Town/City"],
                each["County"],
                each["Type & Rating"],
                each["Route"]
              );
            }
          } else {
            logger.info("There is no update yet");
          }
          resolve(); // Döngü tamamlandığında Promise'i çöz
        } catch (error) {
          reject(error); // Bir hata oluşursa Promise'i reddet
        }
      })
      .on("error", (error) => {
        reject(error); // CSV okuma sırasında bir hata olursa Promise'i reddet
      });
  });
};
