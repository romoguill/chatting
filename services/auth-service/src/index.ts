import { createApp } from "./app";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { SERVICE_NAME } from "./utils/constants";

const main = async () => {
  const app = createApp();
  try {
    app.listen(env.PORT, () =>
      logger.info(
        { port: env.PORT },
        `${SERVICE_NAME} is running on port ${env.PORT}`
      )
    );
  } catch (error) {
    logger.error(error, `Error starting ${SERVICE_NAME}`);
    process.exit(1);
  }
};

void main();
