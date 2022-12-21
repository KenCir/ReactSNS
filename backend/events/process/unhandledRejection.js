/**
 * @param {import('log4js').Logger} logger
 * @param {Error} error
 * @param {Promise<any>} promise
 */
// eslint-disable-next-line no-unused-vars
module.exports = async (logger, error, promise) => {
    logger.error(error);
};