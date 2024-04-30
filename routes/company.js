const express = require("express");
const companyController = require("../controllers/company");
const router = express.Router();

router.post("/init", companyController.createCompanyModel);
router.post("/create", companyController.createCompany);
router.get("/get/:companyName", companyController.getCompanyByName);
router.put("/update/:companyName", companyController.updateCompany);
router.put(
  "/update-with-extra-details/:companyName",
  companyController.updateCompanyWithExtraDetails
);
router.delete("/delete/:companyName", companyController.deleteCompany);
router.post("/get-extra-details", companyController.getExtraDetailsForCompany);
router.get("/jobs", companyController.fetchJobs);
module.exports = router;
