import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  API_URL: z.string(),
  HOST: z.string(),
  PORT: z.string().default("5002"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  CORS_ORIGINS: z.string(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USERNAME: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_EMAIL: z.string(),
});

const env = envSchema.parse(process.env);

export const config = Object.freeze({
  API_URL: env.API_URL,
  HOST: env.HOST,
  PORT: env.PORT,
  NODE_ENV: env.NODE_ENV,

  cors: {
    origin: JSON.parse(env.CORS_ORIGINS),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },

  smtp: {
    SMTP_HOST: env.SMTP_HOST,
    SMTP_PORT: env.SMTP_PORT,
    SMTP_USERNAME: env.SMTP_USERNAME,
    SMTP_PASSWORD: env.SMTP_PASSWORD,
    SMTP_EMAIL: env.SMTP_EMAIL,
  },
} as const);
