const log4js = require("log4js");

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
    },
    categories: { 
        default: { appenders: ["process", "out"], level: "info" }, 
        global: { appenders: ["process", "out"], level: "info" },
        core: { appenders: ["process", "out"], level: "info" },
        frontend: { appenders: ["process", "out"], level: "info" },
        backend: { appenders: [ "process", "out" ], level: "info" }
    }
});

const logger = log4js.getLogger("global");
logger.info("Logging system initialized.");