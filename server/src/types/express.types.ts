import { Request } from "express";
import { JWTPayload } from "./jwt.types.js";

// Use req: AuthRequest for routes/middleware that require access to the authenticated user (e.g., after JWT verification).
export interface AuthRequest extends Request {
  user?: JWTPayload;
}
// Use req: Request for routes/middleware that don’t need user info.