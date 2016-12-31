'use strict'
const userKeys = require('./userKeys.js')
const logger = require('sonos-discovery/lib/helpers/logger')
const path = require('path')
const fs = require('fs')

let settings = {
  port: 3000,
  securePort: 5006,
  cacheDir: path.resolve(__dirname, 'lib/sonos/cache'),
  webroot: path.resolve(__dirname, 'lib/sonos/static'),
  presetDir: path.resolve(__dirname, 'lib/sonos/presets'),
  announceVolume: 40
}

settings.presets = {
  players: [{
    roomName: 'Living Room',
    volume: 20
  }, {
    roomName: 'Master Bedroom',
    volume: 15
  }],
  playMode: {
    shuffle: true,
    repeat: 'all',
    crossfade: false
  },
  pauseOthers: false,
  favorite: 'Nolita Knights Radio',
  voicerss: userKeys.voiceRSS
}

logger.debug(settings)

if (!fs.existsSync(settings.webroot + '/tts/')) {
  fs.mkdirSync(settings.webroot + '/tts/')
}

if (!fs.existsSync(settings.cacheDir)) {
  try {
    fs.mkdirSync(settings.cacheDir)
  } catch (err) {
    logger.warn(`Could not create cache directory ${settings.cacheDir}, please create it manually for all features to work.`)
  }
}

module.exports = settings
