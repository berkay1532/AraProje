require("dotenv").config();

module.exports = {
  database: {
    mongodb_uri: process.env.MONGODB_URI,
  },
  node_env: process.env.NODE_ENV,
  server: {
    port: process.env.PORT,
  },
};
