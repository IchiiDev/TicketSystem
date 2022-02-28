const log4js = require("log4js");
const { DEBUG_WS } = require("../../config");

log4js.configure({
    appenders: { 
        out: { 
            type: "stdout", 
            layout: { 
                type: "pattern", 
                pattern: "%[[%d{hh:mm:ss}] [%p] %c -%] %m"
            } 
        }, 
        process: { 
            type: "file", 
            filename: "logs/process.log", 
            maxLogSize: 10485760, 
            backups: 3, 
            keepFileExt: true, 
            layout: { 
                type: "pattern", 
                pattern: "[%d{yyyy/MM/dd | hh:mm:ss}] [%p] %c - %m" 
            } 
        },
        websocket: {
            type: "file",
            filename: "logs/websocket.log",
            maxLogSize: 10485760,
            backups: 3,
            keepFileExt: true,
            layout: {
                type: "pattern", 
                pattern: "[%d{yyyy/MM/dd | hh:mm:ss}] [%p] %c - %m" 
            }
        }
    },
    categories: { 
        default: { appenders: ["process", "out"], level: "info" }, 
        global: { appenders: ["process", "out"], level: "info" },
        core: { appenders: ["process", "out"], level: "info" },
        frontend: { appenders: ["process", "out"], level: "info" },
        backend: { appenders: [ "process", "out" ], level: "info" },
        websocket: { appenders: (DEBUG_WS) ? ["websocket", "out"] : [ "websocket" ], level: "info" } // This will debug in stdout only if WebSocket is on
    }
});

const logger = log4js.getLogger("global");
logger.info("Logging system initialized.");