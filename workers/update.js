const logger = require("../utils/winstonLogger");
const { parentPort, workerData } = require("worker_threads");
const { downloadCsv } = require("../services/csv");
parentPort?.on("message", async () => {
  logger.info("update csv worker is running");
  await downloadCsv(workerData.date);
});
