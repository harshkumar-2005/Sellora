import nodemailer from "nodemailer";
import envconfig from "../config/env.config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envconfig.email,
    pass: envconfig.emailSecret
  }
});

export default transporter;