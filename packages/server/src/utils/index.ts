import rateLimit from "express-rate-limit";
import { ICustomResponse } from "src/middlewares/response.middleware";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const retryAfterMs =
      Number(res.get("Retry-After")) * 1000 || 15 * 60 * 1000;
    const resetTime = new Date(Date.now() + retryAfterMs).toISOString();

    (res as ICustomResponse).response({
      status: 429,
      message: "Too many requests! Please wait and try again later.",
      data: {
        retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
        resetTime,
      },
    });
  },
});
