const log4js = require("log4js");
const { Server } = require("ws");
const { WSS_PORT } = require("../../config");
const { db } = require("../core/mysql");
const { UserData } = require("./middlewares/auth");

const logger = {
    websocket: log4js.getLogger("websocket"),
    backend: log4js.getLogger("backend")
};

const server = new Server({ port: WSS_PORT });

server.on("error", (error) => {
    logger.backend.error(`Fatal error on "WebSocket" backend: ${error.message}`);
    log4js.shutdown(() => process.exit(1));
});

server.once("listening", () => {
    logger.backend.info(`WebSocket listening on port ${WSS_PORT}`);
});

server.on("connection", (socket) => {

    socket.permission_level = null;
    socket.isAuthed = false;
    setTimeout(() => {
        if (socket.isAuthed) return;
        socket.close(401, "Authentification timeout.");
    }, 10000);

    socket.on("message", data => {
        data = JSON.parse(data.toString());
        
        switch (data.endpoint) {
            case "auth":
                AuthEndpoint(data, socket);
                break;
            case "next_ticket":
                break;
            default:
                logger.websocket.error("Incorrect endpoint from socket: " + data.endpoint);
                socket.send({code: 404, message: "Unknown endpoint"}.toString());
        }
        
    });

});

function AuthEndpoint(data, socket) {
    if (data.token == "update_screen" && !server.update_screen) {
        logger.websocket.info("Client logged in as update_screen.");
        socket.isAuthed = true;
        socket.send({ code: 200, message: "Authentified, successfully as update_screen" }.toString());
        socket.permission_level = "update_screen";
        server.update_screen = socket;
    } else if (UserData[data.token] !== undefined) {
        logger.websocket.info(`Client logged in as ${UserData[data.token].username}`);
        socket.isAuthed = true;
        socket.send({ code: 200, message: "Authentified, successfully as " + UserData[data.token].username }.toString());
        socket.permission_level = "operator";
        socket.username = UserData[data.token].username;
    } 
    else {
        logger.websocket.error("Client tried to log in with unknown token !");
        socket.send({ code: 401, message: "Bad token."}.toString());
    }
}

function nextTicket(data, socket) {
    if (socket.permission_level !== "operator") return socket.send({ code: 401, message: "You don't have the permission to do that." }.toString());

    db.query("SELECT UID, id FROM tickets WHERE active = true LIMIT 1", (err, rows) => {
        if (err) return logger.backend.error(err.message);
        if (rows.length == 0) {
            socket.send({ code: 404, message: "No ticket found." }.toString());
            server.update_screen.send({ code: 404, message: "No ticket found." }.toString());
            return;
        }
        socket.send({ code: 200, message: rows[0] }.toString());
        server.update_screen.send({ code: 200, message: rows[1] }.toString());
        db.query("UPDATE tickets SET active = false AND operator_name =  ? WHERE UID = ?", [socket.username, socket.rows[0].UID], (err) => {
            if (err) return logger.backend.error(err.message);
        });
    });

}