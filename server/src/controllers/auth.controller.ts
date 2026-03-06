import { Request, Response } from "express";
import userSchema from "../schemas/user.schema.js";
import prisma from "../lib/prisma.js";
import argon2 from "argon2";
import { ZodError } from "zod";

// signup route function
export const signup = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validUser = userSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validUser.email },
          { phone: validUser.phoneNumber }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await argon2.hash(validUser.password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: validUser.email,
        password: hashedPassword,
        name: validUser.name,
        phone: validUser.phoneNumber
      }
    });

    // Send response (without password)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone
      }
    });

  } catch (err) {

    // Zod validation error
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err
      });
    }

    // Generic server error
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// login route function
export const login = (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Login route"
    });
}

// getme route function 
export const getme = (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "getme route"
    });
}