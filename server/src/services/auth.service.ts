import prisma from "../lib/prisma.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import envconfig from "../config/env.config.js";

interface SignupInput {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const signupUserService = async (data: SignupInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const hashedPassword = await argon2.hash(data.password);

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phoneNumber,
    },
  });

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    phone: newUser.phone,
  };
};

export const loginUserService = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const isMatch = await argon2.verify(user.password, data.password);

  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_SECRET!,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.REFRESH_SECRET!,
    { expiresIn: "7d" },
  );

  const hashedRefreshToken = await argon2.hash(refreshToken);

  await prisma.refreshToken.create({
    data: {
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const getUserService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

export const refreshTokenService = async (token: string) => {
  const decoded: any = jwt.verify(token, process.env.REFRESH_SECRET!);

  const tokens = await prisma.refreshToken.findMany({
    where: { userId: decoded.userId },
  });

  // compare hashes
  const validToken = await Promise.all(
    tokens.map(async (t) => {
      const isValid = await argon2.verify(t.token, token);
      return isValid ? t : null;
    }),
  );

  // if no valid token found
  if (!validToken.some((t) => t !== null)) {
    throw new Error("INVALID_TOKEN");
  }

  const accessToken = jwt.sign(
    { userId: decoded.userId },
    process.env.ACCESS_SECRET!,
    { expiresIn: "15m" },
  );

  return accessToken;
};

export const logoutService = async (token: string) => {

 const decoded: any = jwt.verify(token, envconfig.refreshSecret!)

 const tokens = await prisma.refreshToken.findMany({
  where: { userId: decoded.userId }
 })

 for (const t of tokens) {
   const valid = await argon2.verify(t.token, token)

   if(valid){
     await prisma.refreshToken.delete({
       where: { id: t.id }
     })
     break
   }
 }
};

export const resetPasswordService = async (email: string, newPassword: string, otp: string) => {

  const verifyOtp = await prisma.otpVerification.findFirst({
    where: {
      identifier: email,
      token: otp,
      type: "PASSWORD_RESET",
      expiresAt: {
        gt: new Date()
      }
    }
  });

  if (!verifyOtp) {
    throw new Error("Invalid or expired OTP");
  }

  const hashedPassword = await argon2.hash(newPassword);

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  // Prevent OTP reuse
  await prisma.otpVerification.delete({
    where: { id: verifyOtp.id }
  });

  return updatedUser;
};
