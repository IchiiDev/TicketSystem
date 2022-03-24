const { request, response } = require("express");
const log4js = require("log4js");

const logger = log4js.getLogger("api");

/**
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {Function} next 
 */
function apiLogging(req, res, next) {

    let ipAddress = req.ip;
    let reqUrl = req.url;
    let reqMethod = req.method;

    logger.info(`${ipAddress}: ${reqMethod} ${reqUrl}`);
    next();
}

module.exports = { apiLogging };