const { configure, getLogger, connectLogger, levels } = require('log4js');
const path = require('path');

configure({
    appenders: {
        out: { type: 'stdout', layout: { type: 'coloured' } },
        app: { type: 'file', filename: (path.join(process.cwd(), 'logs/backend.log')), pattern: 'yyyy-MM-dd.log' },
    },
    categories: {
        default: { appenders: ['out', 'app'], level: 'all' },
    },
});

const logger = getLogger('ReactSNS-Backend');

module.exports = {
    logger: logger,
    express: connectLogger(logger, { level: levels.ALL }),
};