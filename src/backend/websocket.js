const log4js = require("log4js");
const { Server } = require("ws");
const { WSS_PORT } = require("../../config");
const { currentDate } = require("../core/functions/currentDate");
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

    socket.sendMessage = data => {
        socket.send(JSON.stringify(data));
    }

    socket.permission_level = null;
    socket.isAuthed = false;
    setTimeout(() => {
        if (socket.isAuthed) return;
        socket.close();
    }, 10000);

    socket.on("close", () => {
        if (socket.permission_level === "update_screen") server.update_screen = null;
    });

    socket.on("message", data => {
        data = JSON.parse(data.toString());
        
        switch (data.endpoint) {
            case "auth":
                AuthEndpoint(data, socket);
                break;
            case "next_ticket":
                nextTicket(data, socket)
                break;
            default:
                logger.websocket.error("Incorrect endpoint from socket: " + data.endpoint);
                socket.sendMessage({code: 404, message: "Unknown endpoint"});
        }
        
    });

});

function AuthEndpoint(data, socket) {
    if (data.token == "update_screen" && !server.update_screen) {
        logger.websocket.info("Client logged in as update_screen.");
        socket.isAuthed = true;
        socket.sendMessage({ code: 200, message: "Authentified, successfully as update_screen", endpoint: "auth" });
        socket.permission_level = "update_screen";
        server.update_screen = socket;
    } else if (UserData[data.token] !== undefined) {
        logger.websocket.info(`Client logged in as ${UserData[data.token].username}`);
        socket.isAuthed = true;
        socket.sendMessage({ code: 200, message: "Authentified, successfully as " + UserData[data.token].username, endpoint: "auth" });
        socket.permission_level = "operator";
        socket.username = UserData[data.token].username;
    } 
    else {
        logger.websocket.error("Client tried to log in with unknown token !");
        socket.sendMessage({ code: 401, message: "Bad token.", endpoint: "auth" });
    }
}

function nextTicket(data, socket) {
    if (socket.permission_level !== "operator") return socket.sendMessage({ code: 401, message: "You don't have the permission to do that.", endpoint: "next_ticket" });

    db.query("SELECT UID, display_name FROM tickets WHERE active = 1 LIMIT 1", (err, rows) => {
        if (err) {
            logger.backend.error(err.message);
            socket.sendMessage({ code: 500, message: "Internal Server Error", error: err.message, endpoint: "next_ticket" });
            return;
        }
        if (rows.length == 0) {
            socket.sendMessage({ code: 404, message: "No ticket found.", endpoint: "next_ticket" });
            server.update_screen.sendMessage({ code: 404, message: "No ticket found.", endpoint: "next_ticket" });
            return;
        }
        db.query("UPDATE tickets SET active = 0, operator_name = ?, closed_date = ? WHERE UID = ?", [socket.username, currentDate(), rows[0].UID], (err) => {
            if (err) {
                logger.backend.error(err.message);
                socket.sendMessage({ code: 500, message: "Internal Server Error", error: err.message, endpoint: "next_ticket" });
                return;
            }
            socket.sendMessage({ code: 200, message: rows[0], endpoint: "next_ticket" });
            server.update_screen.sendMessage({ code: 200, message: rows[0], endpoint: "next_ticket" });
        });
    });

}