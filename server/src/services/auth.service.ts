import prisma from "../lib/prisma.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

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
