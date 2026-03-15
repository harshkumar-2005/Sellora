import "dotenv/config";

const envconfig = {
  port: process.env.PORT || 3000,
  dburl: process.env.DATABASE_URL,
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  email: process.env.EMAIL,
  emailSecret: process.env.PASSWORD,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
};

export default envconfig;
