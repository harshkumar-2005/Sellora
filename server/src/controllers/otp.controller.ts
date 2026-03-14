import { Request, Response } from "express";
import { sendOtpService, verifyOtpService } from "../services/otp.service.js";
import { VerificationType } from "@prisma/client";

export const sendOtp = async (req: Request, res: Response) => {
  try {

    const { identifier } = req.body;
    const verificationType: VerificationType = req.body.verificationType;

    if (!identifier || !verificationType) {
      return res.status(400).json({
        success: false,
        message: "identifier and verificationType are required"
      });
    }

    if (!Object.values(VerificationType).includes(verificationType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification type"
      });
    }

    await sendOtpService(identifier, verificationType);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (err: any) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {

    const { identifier, otp, verificationType } = req.body;

    if (!identifier || !otp || !verificationType) {
      return res.status(400).json({
        success: false,
        message: "identifier, otp and verificationType are required"
      });
    }

    const verified = await verifyOtpService(identifier, otp, verificationType);

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });

  }
};