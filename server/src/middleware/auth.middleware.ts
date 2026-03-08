import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import { AuthRequest } from "../types/express.types.js";

export const protectRoute = (req: AuthRequest,res: Response,next: NextFunction) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = verifyAccessToken(accessToken);

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
