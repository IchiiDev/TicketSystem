const { request, response } = require("express");
const { db } = require("../../core/mysql");
const log4js = require("log4js");
const { addUser, UserData } = require("../middlewares/auth");
const { DESK_COUNT } = require("../../../config");

const logger = log4js.getLogger("api");

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
function loginEndpoint(req, res) {
    if (req.body.username == undefined || req.body.password == undefined) return res.status(400).json({ code: 400, message: "Bad request" });
    console.log(Object.keys(UserData).length);
    console.log(DESK_COUNT + 1);
    if (Object.keys(UserData).length >= DESK_COUNT) return res.status(503).json({ code: 503, message: "Service Unavailable: Not enough desks" });
    db.query(
        "SELECT username, firstname, lastname FROM users WHERE username=? AND password=?", 
        [req.body.username, req.body.password], 
        (err, results) => {
            if (err) {
                logger.error("Something went wrong with the SQL request (POST /login)");
                res.status(500).json({ code: 500, message: "Internal Server Error" });
                return;
            };
            
            if (results.length < 1) {
                res.status(401).json({ code: 401, message: "Unauthorized" });
                logger.error("User tried to do an unauthorized connection. STATUS=401");
            } else {
                const token = addUser(results[0].username, results[0].firstname, results[0].lastname);
                if (!token) return res.status(400).json({ code: 400, message: "Already logged in" });
                results[0].token = token;
                results[0].desk_number = Object.keys(UserData).length;
                logger.info(`User ${results[0].username} has logged in.`);
                res.status(200).json({ code: 200, message: "Authentified", data: results[0] });
                console.log(results[0]);
            }

        });

}

module.exports = { loginEndpoint };