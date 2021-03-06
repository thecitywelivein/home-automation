'use strict'
const bodyParser = require('body-parser')
const logger = require('./logger.js')
const express = require('express')
const path = require('path')
const app = express()

// Sonos
const SonosSystem = require('sonos-discovery')
const SonosHttpAPI = require('./lib/sonos/sonos-http-api.js')
const settings = require('./sonosSettings.js')
const discovery = new SonosSystem(settings)
const api = new SonosHttpAPI(discovery, settings)

// myQ
const myQ = require('./lib/myQ/garage')

// Wink
const Lights = require('./lib/wink/lights.js')

app.use(bodyParser.json())

app.set('port', process.env.PORT || 3000)

// Serve index if loaded in browser
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/../client/index.html'))
})

// myQ Calls
app.get('/api/garagestatus', function (req, res) {
  myQ.getDoorStatus(req, res)
})

app.get('/api/opengaragedoor', function (req, res) {
  myQ.openGarageDoor(req, res)
})

app.get('/api/closegaragedoor', function (req, res) {
  myQ.closeGarageDoor(req, res)
})

// IFTTT Calls
app.get('/api/lightsoff', function (req, res) {
  Lights.turnOff(req, res)
})

app.get('/api/lightson', function (req, res) {
  Lights.turnOn(req, res)
})

// Sonos Calls
app.get('/api/sonos/*', function (req, res) {
  req.url = req.url.replace('/api/sonos', '')
  api.requestHandler(req, res)
})

app.get('/tts/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'lib/sonos/static/', req.url))
})

// Github Webhook
app.post('/api/github', function (req, res) {
  const exec = require('child_process').exec

  function puts (error, stdout, stderr) {
    if (error) return logger.warn(error)
    logger.info(stdout)
  }
  exec('git pull && npm install', puts)

  logger.info('Payload Received from Github')
  res.send('Thanks Github!')
})

// Wildcard Files
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../', req.url))
})

app.listen(app.get('port'), function () {
  console.log(`\nNode app is running on port ${app.get('port')}\n`)
})
