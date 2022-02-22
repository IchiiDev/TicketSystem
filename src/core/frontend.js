const express = require('express')
const serveStatic = require('serve-static');
const { CLIENT_FRONT_PORT, OP_FRONT_PORT, UPDATE_SCREEN_PORT } = require('../../config');
const log4js = require("log4js");

const logger = log4js.getLogger("frontend");

const clientFrontStartup = () => {
    return new Promise((resolve, reject) => {
        let clientFront = express();
        
        clientFront.use(serveStatic('src/frontend/client', { index: ['index.html', 'index.htm'] }));
        clientFront.listen(CLIENT_FRONT_PORT, () => {            
            logger.info(`Client frontend initialized on port ${CLIENT_FRONT_PORT}`);
            resolve(true);
        }).on('error', e => {
            reject({ front: "client", error: e.message });
        });
    }); 
};

const operatorFrontStartup = () => {
    return new Promise((resolve, reject) => {
        let operatorFront = express();

        operatorFront.use(serveStatic('src/frontend/operator', { index: ['index.html', 'index.htm'] }));
        operatorFront.listen(OP_FRONT_PORT, () => {
            logger.info(`Operator frontend initialized on port ${OP_FRONT_PORT}`);
            resolve(true);
        }).on('error', e => {
            reject({ front: "operator", error: e.message });
        });
    }); 
};

const updateScreenFrontStartup = () => {
    return new Promise((resolve, reject) => {
        let updateFront = express();

        updateFront.use(serveStatic('src/frontend/updates', { index: ['index.html', 'index.htm'] }));
        updateFront.listen(UPDATE_SCREEN_PORT, () => {
            logger.info(`Update screen frontend initialized on port ${UPDATE_SCREEN_PORT}`);
            resolve(true);
        }).on('error', e => {
            reject({ front: "update", error: e.message });
        });
    }); 
};

// Starting front processes
clientFrontStartup()
    .then(() => operatorFrontStartup())
    .then(() => updateScreenFrontStartup())
    .then(() => logger.info("All frontend intialized successfully !"))
    .catch(data => {
        logger.error(`Fatal error while initializing "${data.front}" frontend: ${data.error}`);
        log4js.shutdown(() => {
            process.exit(1);
        });
    });