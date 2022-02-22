const log4js = require("log4js");

log4js.configure({
    appenders: { 
        out: { type: "stdout"}, 
        process: { type: "file", filename: "logs/process.log", maxLogSize: 10485760, backups: 3, keepFileExt: true },
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