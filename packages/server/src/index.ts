import "module-alias/register";
import "./setup-aliases";

import express, { Express, Request, Response } from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import { router } from "./routes";
import { responseHandler } from "src/middlewares/response.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { logger } from "./utils/logger";
import { config } from "./config";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerConfig";
import swaggerUi from "swagger-ui-express";
import { home, notFound } from "./templates";

const app: Express = express();

// ✅ Initialize Swagger first
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Security middleware
app.use(helmet());
app.use(
  cors({
    ...config.cors,
    methods: [...config.cors.methods],
    allowedHeaders: [...config.cors.allowedHeaders],
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);

// Request parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(responseHandler);

// Logging middleware
app.use(
  morgan("dev", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

app.use("/api/v1", [router]);
app.get("/", (_: Request, res: Response) => {
  res.send(home);
});

app.use((_: Request, res: Response) => {
  res.status(404).send(notFound);
});
app.use(errorHandler);

// Start Server
app.listen(config.PORT, () => {
  logger.info(
    `🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`,
  );
  logger.info(`📄 Swagger Docs available at ${config.PORT}/api-docs`);
});

process.on("unhandledRejection", (err: Error) => {
  logger.error("Unhandled Rejection:", err);
  process.exit(1);
});
