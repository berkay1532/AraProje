const createModelService = require("../services/create_model");
const companyService = require("../services/company");

exports.createCompanyModel = async (req, res, next) => {
  try {
    await createModelService.createTable("Company");
    return res
      .status(201)
      .json({ message: "Company model created succesfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createCompany = async (req, res, next) => {
  try {
    const name = req.body.name;
    const city = req.body.city;
    const county = req.body.county;
    const type = req.body.type;
    const route = req.body.route;
    if (!(name && city && county && type && route)) {
      const error = new Error("Body parts are missing");
      error.statusCode = 400;
      throw error;
    }
    await companyService.createCompany(name, city, county, type, route);
    return res.status(201).json({ message: "Company created succesfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.getCompanyByName = async (req, res, next) => {
  try {
    const company_name = req.params.companyName;
    if (!company_name) {
      const error = new Error("Body parts are missing");
      error.statusCode = 400;
      throw error;
    }
    const theCompany = await companyService.getCompanyByName(company_name);
    return res
      .status(200)
      .json({ message: "Company fetched succesfully", company: theCompany });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.updateCompany = async (req, res, next) => {
  try {
    const updatedData = req.body.updatedData;
    const company_name = req.params.companyName;

    if (
      !(
        company_name &&
        updatedData.city &&
        updatedData.county &&
        updatedData.type &&
        updatedData.route
      )
    ) {
      const error = new Error("Body parts are missing");
      error.statusCode = 400;
      throw error;
    }
    await companyService.updateCompany(company_name, updatedData);
    return res.status(200).json({ message: "Company updated succesfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.updateCompanyWithExtraDetails = async (req, res, next) => {
  try {
    const updatedData = req.body.updatedData;
    const company_name = req.params.companyName;

    if (
      !(
        company_name &&
        updatedData.companyType &&
        updatedData.description &&
        updatedData.followers &&
        updatedData.headquarters &&
        updatedData.industry &&
        updatedData.initialRequestLiId &&
        updatedData.liEmployeeCount &&
        updatedData.link &&
        updatedData.logoUrl &&
        updatedData.name &&
        updatedData.salesNavLink &&
        updatedData.size &&
        updatedData.website &&
        updatedData.yearFounded
      )
    ) {
      const error = new Error("Body parts are missing");
      error.statusCode = 400;
      throw error;
    }
    await companyService.updateCompanyWithExtraDetails(
      company_name,
      updatedData
    );
    return res.status(200).json({ message: "Company updated succesfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.deleteCompany = async (req, res, next) => {
  try {
    const company_id = req.params.companyId;
    if (!company_id) {
      const error = new Error("Body parts are missing");
      error.statusCode = 400;
      throw error;
    }

    await companyService.deleteCompany(company_id);
    return res.status(200).json({ message: "Company deleted succesfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getExtraDetailsForCompany = async (req, res, next) => {
  try {
    const companyName = req.body.companyName;
    if (!companyName) {
      const error = new Error("Body parts are missing");
      error.statusCode = 400;
      throw error;
    }
    const data = await companyService.getExtraDetailsForCompany(companyName);
    return res
      .status(200)
      .json({ data: data, message: "Extra details fetched succesfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.fetchJobs = async (req, res, next) => {
  await companyService.fetchJobs();
  return res.status(200).json({ message: "Done" });
};
