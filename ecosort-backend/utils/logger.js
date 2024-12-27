const chalk = require('chalk');

const levels = {
    info: chalk.blue.bold,
    success: chalk.green.bold,
    warning: chalk.yellow.bold,
    error: chalk.red.bold,
    debug: chalk.cyan.bold,
};

const logger = {
    info: (message) => {
        console.log(`${levels.info('[INFO]')} ${message}`);
    },
    success: (message) => {
        console.log(`${levels.success('[SUCCESS]')} ${message}`);
    },
    warning: (message) => {
        console.log(`${levels.warning('[WARNING]')} ${message}`);
    },
    error: (message) => {
        console.log(`${levels.error('[ERROR]')} ${message}`);
    },
    debug: (message) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`${levels.debug('[DEBUG]')} ${message}`);
        }
    },
};

module.exports = logger;
