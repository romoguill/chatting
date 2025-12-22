import express, { type Application } from "express";

export function createApp(): Application {
  const app = express();

  return app;
}
