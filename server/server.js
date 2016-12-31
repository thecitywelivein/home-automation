const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const path = require('path')

// Sonos
const SonosSystem = require('sonos-discovery')
const SonosHttpAPI = require('./lib/sonos/sonos-http-api')
const settings = require('./sonosSettings')
const discovery = new SonosSystem(settings)
const api = new SonosHttpAPI(discovery, settings)

// Wink
const Lights = require('./lights')

app.use(bodyParser.json())

app.set('port', process.env.PORT || 3000)

// Serve index if loaded in browser
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/../client/index.html'))
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

// Wildcard Files
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../', req.url))
})

app.listen(app.get('port'), function () {
  console.log(`\nNode app is running on port ${app.get('port')}\n`)
})
