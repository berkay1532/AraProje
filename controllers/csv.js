const csvService = require("../services/csv");

exports.downloadCsv = async (req, res, next) => {
  try {
    const date = req.body.date;
    try {
      await csvService.downloadCsv(date);
    } catch {
      const error = new Error("Can not download csv");
      error.statusCode = 400;
      throw error;
    }

    return res.status(200).json({ message: "Csv downloaded succesfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteCsv = async (req, res, next) => {
  try {
    try {
      await csvService.deleteCsv();
    } catch {
      const error = new Error("Can not delete files inside csv folder");
      error.statusCode = 400;
      throw error;
    }
    return res.status(200).json({ message: "Csv deleted succesfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.syncCsvToDatabase = async (req, res, next) => {
  try {
    try {
      const date = req.body.date;
      await csvService.syncCsvToDatabase(date);
    } catch {
      const error = new Error("Can not sync csv to database");
      error.statusCode = 400;
      throw error;
    }
    return res.status(200).json({ message: "Sync proccess done succesfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
