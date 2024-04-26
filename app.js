const express = require("express");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const logger = require("./utils/winstonLogger");
const morganMiddleware = require("./utils/morganStream");

const config = require("config");

const app = express();

const daily_schedule = require("./daily_schedule");

const companyRoutes = require("./routes/company");
const csvRoutes = require("./routes/csv");

var cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS Policy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

//helpers
app.use(helmet());
app.use(compression());

app.get("/", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "./views/index.html"));
});

app.use(morgan("combined", { morganMiddleware }));

// Route era
app.use("/company", companyRoutes);
app.use("/csv", csvRoutes);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const cleanedMessage = error.message.replace(/\\x1b\[\d+m/g, "");

  logger.error(cleanedMessage);
  const status = error.statusCode || 500;
  const message = error.message.toString().trim();
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
  daily_schedule.cronJob(); // Cron job'ı başlat
});

module.exports = app;
