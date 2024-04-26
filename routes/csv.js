const express = require("express");
const csvController = require("../controllers/csv");
const router = express.Router();

router.post("/download", csvController.downloadCsv);
router.delete("/delete", csvController.deleteCsv);
router.post("/sync", csvController.syncCsvToDatabase);

module.exports = router;
