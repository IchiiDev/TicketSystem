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

const server = new Server({ port: WSS_PORT }); // Initialisation du serveur WebSocket

// Ce code s'exécute dès que le serveur rencontre une erreur
server.on("error", (error) => {
    logger.backend.error(`Fatal error on "WebSocket" backend: ${error.message}`);
    log4js.shutdown(() => process.exit(1));
});

// Ce code s'exécute dès que le serveur est prêt
server.once("listening", () => {
    logger.backend.info(`WebSocket listening on port ${WSS_PORT}`);
});

// Ce code s'exécute dès que le serveur reçoit une connection
server.on("connection", (socket) => {
    
    // Definition des fonctions de communication avec le client (Custom)
    socket.sendMessage = data => {
        socket.send(JSON.stringify(data));
    }

    socket.permission_level = null;
    socket.isAuthed = false;
    // La connection au WebSocket est fermée après 10 secondes sans authentification
    setTimeout(() => {
        if (socket.isAuthed) return;
        socket.close();
    }, 10000);

    // Ce code s'exécute dès que le client coupe la connection
    socket.on("close", () => {
        if (socket.permission_level === "update_screen") server.update_screen = null; // Retire l'écran d'actualisation sauvegardé si il se déconnecte
    });

    // Fonction principale du WebSocket
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

// Cette fonction gère les authentifications
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
        socket.desk_number = UserData[data.token].desk_number;
    } 
    else {
        logger.websocket.error("Client tried to log in with unknown token !");
        socket.sendMessage({ code: 401, message: "Bad token.", endpoint: "auth" });
    }
}

// Cette fonction retourne le prochain ticket et le communique à l'écran d'actualisation
function nextTicket(data, socket) {
    if (socket.permission_level !== "operator") return socket.sendMessage({ code: 401, message: "You don't have the permission to do that.", endpoint: "next_ticket" });

    // séléctionne le ticket le moins récent dans la base de donnée SQL
    db.query("SELECT UID, display_name FROM tickets WHERE active = 1 LIMIT 1", (err, rows) => {
        // Retourne une erreur si la requête a échoué
        if (err) {
            logger.backend.error(err.message);
            socket.sendMessage({ code: 500, message: "Internal Server Error", error: err.message, endpoint: "next_ticket" });
            return;
        }
        // Renvoie une erreur si aucun ticket n'est ouvert
        if (rows.length == 0) {
            socket.sendMessage({ code: 404, message: "No ticket found.", endpoint: "next_ticket" });
            server.update_screen.sendMessage({ code: 404, message: "No ticket found.", endpoint: "next_ticket" });
            return;
        }
        // Edite le ticket dans la base de donnée et le renvoie à l'opérateur et à l'écran d'actualisation
        db.query("UPDATE tickets SET active = 0, operator_name = ?, closed_date = ? WHERE UID = ?", [socket.username, currentDate(), rows[0].UID], (err) => {
            if (err) {
                logger.backend.error(err.message);
                socket.sendMessage({ code: 500, message: "Internal Server Error", error: err.message, endpoint: "next_ticket" });
                return;
            }
            socket.sendMessage({ code: 200, message: rows[0], endpoint: "next_ticket" });
            rows[0].desk_number = socket.desk_number;
            server.update_screen.sendMessage({ code: 200, message: rows[0], endpoint: "next_ticket" });
        });
    });

}