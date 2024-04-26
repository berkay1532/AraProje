const express = require("express");
const companyController = require("../controllers/company");
const router = express.Router();

router.post("/init", companyController.createCompanyModel);
router.post("/create", companyController.createCompany);
router.get("/get/:companyId", companyController.getCompanyById);
router.put("/update/:companyId", companyController.updateCompany);
router.delete("/delete/:companyId", companyController.deleteCompany);

module.exports = router;
