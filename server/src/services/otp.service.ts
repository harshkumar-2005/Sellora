import argon2 from "argon2";
import prisma from "../lib/prisma.js";
import { VerificationType } from "@prisma/client";
import generateOtp from "../utils/generate.otp.js";
import envconfig from "../config/env.config.js";
import transporter from "../lib/mailer.js";

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 3;

export const sendOtpService = async (
  identifier: string,
  verificationType: VerificationType
) => {

  // rate limit check (1 OTP per minute)
  const recentOtp = await prisma.otpVerification.findFirst({
    where: {
      identifier,
      type: verificationType,
      createdAt: {
        gt: new Date(Date.now() - 60 * 1000)
      }
    }
  });

  if (recentOtp) {
    throw new Error("OTP recently sent. Please wait.");
  }

  // remove previous OTP
  await prisma.otpVerification.deleteMany({
    where: {
      identifier,
      type: verificationType
    }
  });

  const otp = generateOtp();

  const hashedOtp = await argon2.hash(otp);

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await prisma.otpVerification.create({
    data: {
      identifier,
      token: hashedOtp,
      type: verificationType,
      expiresAt
    }
  });

  await transporter.sendMail({
    from: envconfig.email,
    to: identifier,
    subject: "Your OTP Code",
    text: `Your OTP for verification is ${otp}. It will expire in 5 minutes.`
  });

  return true;
};

export const verifyOtpService = async (
  identifier: string,
  otp: string,
  verificationType: VerificationType
) => {

  const record = await prisma.otpVerification.findFirst({
    where: {
      identifier,
      type: verificationType
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (!record) return false;

  // check expiry
  if (record.expiresAt < new Date()) {

    await prisma.otpVerification.delete({
      where: { id: record.id }
    });

    return false;
  }

  // attempt protection
  if (record.attempts >= MAX_ATTEMPTS) {

    await prisma.otpVerification.delete({
      where: { id: record.id }
    });

    return false;
  }

  const valid = await argon2.verify(record.token, otp);

  if (!valid) {

    await prisma.otpVerification.update({
      where: { id: record.id },
      data: {
        attempts: {
          increment: 1
        }
      }
    });

    return false;
  }

  // success → delete OTP
  await prisma.otpVerification.delete({
    where: { id: record.id }
  });

  return true;
};