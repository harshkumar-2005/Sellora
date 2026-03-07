import "dotenv/config";

const config = {
  port: process.env.PORT || 3000,
  dburl: process.env.DATABASE_URL,
  accessSecert: process.env.ACCESS_SECRET,
  refreshSecert: process.env.REFRESH_SECRET,
};

export default config;
