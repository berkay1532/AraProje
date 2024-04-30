require("dotenv").config();

module.exports = {
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
  node_env: process.env.NODE_ENV,
  server: {
    port: process.env.PORT,
  },
  lix: {
    api_key: process.env.LIX_API_KEY,
  },
};
