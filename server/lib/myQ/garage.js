'use strict'
const path = require('path')
const {username, password, garageId} = require(path.resolve('server/userKeys')).myQ
const logger = require(path.resolve('server/logger'))
const myQ = require('myqnode').myQ
const moment = require('moment')

module.exports = {
  // Call this method to retrieve your myQ devices. Copy the deviceId over to userKeys
  getDevices: () => {
    myQ.getDevices(username, password)
    .then((respObj) =>
      console.log(`These are your devices:`, respObj)
    , (respObj) =>
      console.error(`Error executing method`, respObj)
    )
  },
  getDoorStatus: (req, res) => {
    myQ.getDoorStatus(username, password, garageId)
      .then((state) =>
        res.send({
          currentState: state.toLowerCase()
        })
      )
  },
  openGarageDoor: (req, res) => {
    myQ.openDoor(username, password, garageId)
      .then((state) => {
        logger.info(`• ${moment().format('L')} - Opened garage door at ${moment().format('LT')}`)
        res.send(`Opened garage door at ${moment().format('LT')}`)
      },
      (err) => {
        logger.error(`• ${moment().format('L')} - Error opening garage door at ${moment().format('LT')}`)
        res.send(`Error opening garage door at ${moment().format('LT')}`, err)
      })
  },
  closeGarageDoor: (req, res) => {
    myQ.closeDoor(username, password, garageId)
      .then((state) => {
        logger.info(`• ${moment().format('L')} - Closed garage door at ${moment().format('LT')}`)
        res.send(`Closed garage door at ${moment().format('LT')}`)
      },
      (err) => {
        logger.error(`• ${moment().format('L')} - Error closing garage door at ${moment().format('LT')}`)
        res.send(`Error closing garage door at ${moment().format('LT')}`, err)
      })
  }
}
