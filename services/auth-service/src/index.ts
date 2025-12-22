import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { IncomingMessage, ServerResponse } from "node:http";
import { Server } from "node:https";
import { createApp } from "./app";
import { closeDb, connectDb } from "./db/sequelize";
import { syncModels } from "./models";
import { SERVICE_NAME } from "./utils/constants";

const main = async () => {
  const app = createApp();
  let server: Server;

  // ---- DB connection ----
  try {
    await connectDb();
    await syncModels();
  } catch (error) {
    logger.error(error, `Error starting ${SERVICE_NAME}`);
    process.exit(1);
  }

  // ---- Start server ----
  try {
    server = app.listen(env.PORT, () =>
      logger.info(
        { port: env.PORT },
        `${SERVICE_NAME} is running on port ${env.PORT}`,
      ),
    ) as Server<typeof IncomingMessage, typeof ServerResponse>;
  } catch (error) {
    logger.error(error, `Error starting ${SERVICE_NAME}`);
    process.exit(1);
  }

  // ---- Shutdown server ----
  const shutdown = () => {
    logger.info({ serviceName: SERVICE_NAME }, "Shutting down");

    // TODO: Add shutdown logic
    // Close DB,
    Promise.all([closeDb()])
      .catch((error) => logger.error({ error }, "Error shutting down"))
      .finally(() => server.close());
  };

  // ---- Shutdown server on signal ----
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

void main();
