import { SwaggerDefinition, Options } from "swagger-jsdoc";
import path from "path";
import { config } from "./config";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "Documentation for our API",
  },
  servers: [
    {
      url: `${config.HOST}/api/v1`,
      description: "Enovia",
    },
  ],
};

export const swaggerOptions: Options = {
  swaggerDefinition,
  apis: [path.join(__dirname, "routes/*.ts")],
};
