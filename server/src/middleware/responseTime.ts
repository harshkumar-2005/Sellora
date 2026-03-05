import { Request, Response, NextFunction } from "express";

/**
 * Middleware to log the response time, status code, and method of an incoming request.
 */
export const responseTime = (req: Request, res: Response, next: NextFunction): void => {
    // Record the high-resolution start time
    const start = Date.now();

    // The 'finish' event fires when the response has been sent to the client
    res.on("finish", () => {
        const duration = Date.now() - start;
        const status = res.statusCode;

        // Determine success based on HTTP status codes
        const isSuccess = status >= 200 && status < 400;
        const symbol = isSuccess ? "✔" : "✘";

        // Structured log output
        console.log(`${req.method} ${req.originalUrl || req.url} ${symbol} ${status} - ${duration}ms`);
    });

    next();
};