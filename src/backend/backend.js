const express = require("express");
const { API_PORT } = require("../../config");
const log4js = require("log4js");

const logger = log4js.getLogger("backend");

const api = express();

api.listen(API_PORT, () => {
    logger.info(`API backend successfully initialized ! Port: ${API_PORT}`);
}).on("error", e => {
    logger.error(`Fatal error while initializing API backend: ${e.message}`);
    log4js.shutdown(() => {
        process.exit(1);
    });
});