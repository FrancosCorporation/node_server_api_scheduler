import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import { config } from "./config/env";

const app = express();
const allowedOrigins = new Set(config.corsOrigins);

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (origin === undefined || !allowedOrigins.has(origin)) {
        callback(null, false);
        return;
      }

      callback(null, origin);
    },
    methods: ["GET", "HEAD", "OPTIONS"],
  }),
);

app.get("/", (_request, response) => {
  response.status(200).json({
    status: "skeleton",
    message: "API em construção. O agendador ainda não foi implementado.",
  });
});

app.get("/healthz", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use((_request, response) => {
  response.status(404).json({ error: "not_found" });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error("Request failed:", error);
  if (response.headersSent) return;
  response.status(500).json({ error: "internal_server_error" });
};

app.use(errorHandler);

export { app };
