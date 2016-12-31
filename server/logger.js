const winston = require('winston')
const fs = require('fs')
const logDir = 'log'

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const tsFormat = () => (new Date()).toLocaleTimeString()

const logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: tsFormat
    })
  ]
})

module.exports = logger
// logger.info('Hello world')
// logger.warn('Warning message')
// logger.debug('Debugging info')
