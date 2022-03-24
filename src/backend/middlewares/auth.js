const { request, response } = require("express");
const crypto = require("crypto");

let UserData = {};
let LoggedUsers = [];

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
function Auth(req, res, next) {
    if (req.url == "/login") return next();
    
    if (UserData[req.headers.authorization] !== undefined) {
        req.userData = UserData[req.headers.authorization];
        next();
    } else {
        res.status(401).json({ code: 401, message: "Unauthorized" });
    }

}

function addUser(username, firstname, lastname) {
    if (LoggedUsers.indexOf(username) > -1) return null
    token = genToken();
    UserData[token] = { username, firstname, lastname };
    LoggedUsers.push(username);

    setTimeout(() => {
        delete UserData[token];
        LoggedUsers.splice(LoggedUsers.indexOf(username), 1);
    }, 43200000);

    return token;
}

const genToken = () => {
    return crypto.randomBytes(64).toString("base64");
};

module.exports = { Auth, addUser };