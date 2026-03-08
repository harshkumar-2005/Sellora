import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/jwt.types.js";
import envconfig from "../config/env.config.js";

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, envconfig.accessSecret!) as JWTPayload;
};
