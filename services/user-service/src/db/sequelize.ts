import { Sequelize } from "sequelize";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

export const sequelize = new Sequelize(env.USER_DB_URL, {
  dialect: "postgres",
  logging:
    env.NODE_ENV === "development"
      ? (msg) => logger.debug({ orm: msg })
      : false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
});

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    logger.info("User database connected successfully");
    return sequelize;
  } catch (error) {
    logger.error({ error }, "Error connecting to db");
    throw error;
  }
};

export const closeDb = async () => {
  try {
    await sequelize.close();
    logger.info("User database disconnected successfully");
  } catch (error) {
    logger.error({ error }, "Error disconnecting from database");
  }
};

export const initDb = async () => {
  await connectDb();
};
