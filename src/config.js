import yargs from 'yargs';

export default yargs
  .env('POPCORN2MQTT')
  .usage('Usage: $0 [options]')
  .describe('p', 'IP address or host name of the Popcorn Hour device')
  .describe('h', 'Show this help')
  .describe('l', 'Logging level')
  .describe('m', 'MQTT broker url. See https://github.com/mqttjs/MQTT.js#connect-using-a-url')
  .describe('k', 'Accept self singed-certificates when using TLS. See https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options')
  .describe('n', 'Instance name. Used as MQTT client ID and as topic prefix')
  .boolean('k')
  .alias({
    p: 'popcornhour',
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
    m: 'mqtt://127.0.0.1',
    k: false,
    n: 'popcornhour'
  })
  .version()
  .help('help')
  .wrap(null)
  .argv;
