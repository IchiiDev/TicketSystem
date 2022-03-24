const express = require("express");
const { API_PORT } = require("../../config");
const log4js = require("log4js");
const { Auth } = require("./middlewares/auth");
const { LoginEndpoint } = require("./endpoints/login");
const bodyParser = require("body-parser");
const { apiLogging } = require("./middlewares/apiLogging");

const logger = log4js.getLogger("backend");

const api = express();

api.use(bodyParser.json());
api.use(apiLogging);
api.use(Auth);

// Defining callable endpoints
api.post("/login", LoginEndpoint);

api.listen(API_PORT, () => {
    logger.info(`API backend successfully initialized ! Port: ${API_PORT}`);
}).on("error", e => {
    logger.error(`Fatal error while initializing API backend: ${e.message}`);
    log4js.shutdown(() => process.exit(1));
});