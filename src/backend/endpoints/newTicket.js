const { db } = require("../../core/mysql");
const log4js = require("log4js");

let ticketNumber = 1;
const logger = log4js.getLogger("api");

function newTicketEndpoint(req, res) {
    
    db.query("INSERT INTO tickets (display_name) VALUES (?)", [ticketNumber], (err, rows) => {
        if (err) {
            res.status(500).json({ message: "Internal Server Error", error: err.message });
            logger.error(err);
            return;
        }
        res.status(200).json({ ticketId: ticketNumber });
        ticketNumber++;
    });

}

module.exports = { newTicketEndpoint };