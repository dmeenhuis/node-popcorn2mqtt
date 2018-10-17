const fetch = require('node-fetch');
const log = require('yalm');
const mqtt = require('mqtt');
const xmlParser = require('fast-xml-parser');
const from = require('rxjs').from;
const interval = require('rxjs').interval;
const switchMap = require('rxjs/operators').switchMap;
const takeWhile = require('rxjs/operators').takeWhile;

const config = require('./config.js');

function poll(fetchFn, isSuccessFn, pollInterval) {
  return interval(pollInterval).pipe(
      switchMap(() => from(fetchFn())),
      takeWhile((response) => isSuccessFn(response))
  );
}

const pad = (num) => (`0${num}`).slice(-2);

const toDuration = (seconds) => {
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  const hours = Math.floor(minutes / 60);
  minutes = minutes % 60;

  const format = (...vals) => vals.map(pad).join(':');

  if (hours) return format(hours, minutes, seconds);

  return format(minutes, seconds);
}

const getFilename = (path) => path.split('/').pop();

function publishConnectionStatus() {
  const status = '1';

  mqttClient.publish(config.name + '/connected', status, {
    qos: 0,
    retain: true
  });
}

function publishPlaybackStatus(newState, extraData = {}) {
  let data = {
    val: newState, // Using val according to the MQTT Smarthome specs.
    name: 'media_player.popcorn-hour',
    ts: Date.now()
  }

  Object.assign(data, extraData);

  const topic = `${config.name}/playback/status`
  log.info(`Publishing ${newState} to ${topic}`);

  mqttClient.publish(topic,
    JSON.stringify(data),
    { qos: 0, retain: true }
  )
}

(async () => {
  log.setLevel(config.logging);

  const mqttOptions = {
    will: {
      topic: config.name + '/connected',
      message: 0,
      qos: 0,
      retain: true
    },
    rejectUnauthorized: !config.insecure
  };

  mqttClient = mqtt.connect(config.mqtt, mqttOptions);

  mqttClient.on('connect', () => {
    log.info(`Connected to MQTT: ${config.mqtt}`);
    publishConnectionStatus();
    //mqttClient.subscribe(config.name + '/set/+/+');
  });

  mqttClient.on('close', () => {
    log.info(`MQTT closed ${config.mqtt}`);
  })

  mqttClient.on('error', err => {
    log.error(`mqtt error: ${err}`);
  })

  mqttClient.on('offline', () => {
    log.error('mqtt offline');
  })

  mqttClient.on('reconnect', () => {
    log.info('mqtt reconnect');
  })

  const playbackVodUrl = `http://${config.popcornhour}:8008/playback?arg0=get_current_vod_info`;
  let lastStatus;

  poll(
    () =>
      fetch(playbackVodUrl)
        .then(res => res.text())
        .then(body => xmlParser.parse(body))
        .catch(err => {
          log.error(err);
          return undefined;
        }),
    () => true,
    parseInt(config.interval)
  ).subscribe(data => {
    if (!data) return;

    const { theDavidBox: { response } } = data;

    if (response === '') return;  // Empty response; apparently nothing is playing

    const { currentStatus, currentTime, title, totalTime } = response;   // pause | play

    if (!['play', 'pause'].includes(currentStatus)) {
      log.info(`Received unsupported status ${currentStatus}; ignoring`);
      return;
    }

    if (lastStatus == currentStatus) return;

    const payload = {
      currentTime: toDuration(currentTime),
      title: getFilename(title),
      totalTime: toDuration(totalTime)
    };

    publishPlaybackStatus(currentStatus, payload);

    lastStatus = currentStatus;

  }, err => log.error(err))
})();
