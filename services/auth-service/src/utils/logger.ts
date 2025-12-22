import { createLogger, Logger } from "@chatting/common";
import { SERVICE_NAME } from "@/utils/constants";

export const logger: Logger = createLogger({ name: SERVICE_NAME });
