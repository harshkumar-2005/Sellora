import { Request, Response } from "express";
import { signupUserService, loginUserService } from "../services/auth.service.js";
import userSchema from "../schemas/signup.schema.js";
import loginSchema from "../schemas/login.schema.js";
import { ZodError } from "zod";

// signup route function
export const signup = async (req: Request, res: Response) => {
  try {
    // zod validation
    const validUser = userSchema.parse(req.body);

    // creating user if not exist
    const user = await signupUserService(validUser);

    // response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (err) {
    // zod error
    if (err instanceof ZodError) {
      return res.status(400).json({ success: false, errors: err });
    }

    if (err instanceof Error && err.message === "USER_ALREADY_EXISTS") {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // server error
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// login route function
export const login = async (req: Request, res: Response) => {
  try {
    // zod validation
    const validUser = loginSchema.parse(req.body);

    // checking credentials and then creating & saving refresh token in db
    const { accessToken, refreshToken, user } =
      await loginUserService(validUser);

    // setting refreshToken as cookie at client
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // response
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      user,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ success: false, errors: err });
    }

    if (err instanceof Error) {
      if (err.message === "USER_NOT_FOUND") {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (err.message === "INVALID_CREDENTIALS") {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

// getme route function
export const getme = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
  });
};
