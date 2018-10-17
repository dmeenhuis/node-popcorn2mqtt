const config = require('yargs')
  .env('POPCORN2MQTT')
  .usage('Usage: $0 [options]')
  .describe('p', 'IP address or host name of the Popcorn Hour device')
  .describe('i', 'Sets the polling interval (ms)')
  .describe('h', 'Show this help')
  .describe('l', 'Logging level')
  .describe('m', 'MQTT broker url. See https://github.com/mqttjs/MQTT.js#connect-using-a-url')
  .describe('k', 'Accept self singed-certificates when using TLS. See https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options')
  .describe('n', 'Instance name. Used as MQTT client ID and as topic prefix')
  .boolean('k')
  .alias({
    p: 'popcornhour',
    i: 'interval',
    g: 'password',
    h: 'help',
    l: 'logging',
    m: 'mqtt',
    k: 'insecure',
    n: 'name'
  })
  .choices('l', ['error', 'warn', 'info', 'debug'])
  .default({
    l: 'info',
    i: 1000,
    m: 'mqtt://127.0.0.1',
    k: false,
    n: 'popcorn-hour'
  })
  .version()
  .help('help')
  .wrap(null)
  .argv;

  module.exports = config;
