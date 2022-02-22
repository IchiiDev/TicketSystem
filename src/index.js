const log4js = require("log4js");

// Initiating Logging features
require("./core/logging");
const logger = log4js.getLogger("global");

// Frontend startup
logger.info("Initializing frontend...");
require("./core/frontend");

// Backend startup
logger.info("Initializing backend...");
require("./backend/backend");