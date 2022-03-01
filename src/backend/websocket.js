const log4js = require("log4js");
const { Server } = require("ws");
const { WSS_PORT } = require("../../config");

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

    socket.isAuthed = false;
    setTimeout(() => {
        if (socket.isAuthed) return;
        // socket.close(401, "Too much time to auth");
        socket.close();
    }, 10000);

    socket.on("message", data => {
        data = JSON.parse(data.toString());
        
        switch (data.endpoint) {
            case "auth":
                if (data.token == "update_screen") {
                    logger.websocket.info("Client logged in as update_screen.");
                    socket.isAuthed = true;
                    socket.send({ code: 200, message: "Authentified, successfully as update_screen" }.toString());
                } else {
                    logger.websocket.error("Client tried to log in with unknown token !");
                    socket.send({ code: 401, message: "Bad token."}.toString());
                }
                break;
            default:
                logger.websocket.error("Incorrect endpoint from socket: " + data.endpoint);
                socket.send({code: 404, message: "Unknown endpoint"}.toString());
        }
        
    });

});