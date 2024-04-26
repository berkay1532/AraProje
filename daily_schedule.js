const cron = require("node-cron");
const logger = require("./utils/winstonLogger");
const { Worker } = require("worker_threads");
const path = require("path");

// cronJob fonksiyonunu tanımla
function cronJob() {
  const task = cron.schedule("0 21 * * *", () => {
    const today = new Date().toISOString().split("T")[0]; // Bugünün tarihini al
    logger.info("Günde bir kez çalışacak görev başlıyor.");

    // Worker'ı günlük olarak başlat
    const updateWorker = new Worker(
      path.join(__dirname, "workers", "update.js"),
      {
        workerData: { date: today },
      }
    );

    updateWorker.on("message", (message) => console.log(message));
    updateWorker.on("error", (error) => console.error("Worker error:", error));
    updateWorker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
    });

    updateWorker.postMessage(0);
  });

  task.start();
}

module.exports = { cronJob };
