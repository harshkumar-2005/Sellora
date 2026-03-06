import { Request, Response, NextFunction } from "express";

/* ANSI color helpers */
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

export const responseTime = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000;

    const status = res.statusCode;
    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"] || "unknown";
    const contentLength = res.getHeader("content-length") || 0;

    let color = colors.green;
    let symbol = "✔";

    if (status >= 400 && status < 500) {
      color = colors.yellow;
      symbol = "⚠";
    }

    if (status >= 500) {
      color = colors.red;
      symbol = "✘";
    }

    const time = new Date().toISOString();

    console.log(
      `${colors.cyan}[${time}]${colors.reset} ${method} ${url} ` +
      `${color}${symbol} ${status}${colors.reset} ` +
      `${duration.toFixed(2)}ms ` +
      `size:${contentLength} ` +
      `ip:${ip}`
    );
  });

  next();
};