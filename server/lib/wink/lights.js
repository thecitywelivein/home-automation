'use strict'
const path = require('path')
const userKeys = require(path.resolve('server/userKeys'))
const logger = require(path.resolve('server/logger'))
const unirest = require('unirest')
const moment = require('moment')

module.exports = {
  turnOff: (req, res) =>
    iftttGET(req, res, 'lights_off'),
  turnOn: (req, res) =>
    iftttGET(req, res, 'lights_on')
}

function iftttGET (req, res, event) {
  const request = unirest('GET', `https://maker.ifttt.com/trigger/${event}/with/key/${userKeys.makerKey}`)
  request.end((response) => {
    if (response.error) throw new Error(response.error)
    logger.info(`• ${moment().format('L')} - IFTTT fired ${event} event at ${moment().format('LT')}`)
    res.send(response.body)
  })
}
