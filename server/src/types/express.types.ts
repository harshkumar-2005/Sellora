import { Request } from "express";
import { JWTPayload } from "./jwt.types.js";

export interface AuthRequest extends Request {
  user?: JWTPayload;
}