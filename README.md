# popcorn2mqtt

[![mqtt-smarthome](https://img.shields.io/badge/mqtt-smarthome-blue.svg)](https://github.com/mqtt-smarthome/mqtt-smarthome)
[![Build Status](https://travis-ci.org/dmeenhuis/node-popcorn2mqtt.svg?branch=master)](https://travis-ci.org/dmeenhuis/node-popcorn2mqtt)
[![License][mit-badge]][mit-url]

> Gateway between a Popcorn Hour media player and MQTT

## Introduction

Having just started with home automation and using Home Assistant, I found out it's possible to create automations based on whether the media player is currently playing or paused, so that one can dim the lights when it is playing.

Unfortunately one of my main media players is an old Popcorn Hour device, for which no component exists within Home Assistent. After some experimenting I discovered that the Popcorn Hour device comes with an API that exposes an endpoint that returns the current playback status.

Albeit this being a fairly crude approach (it uses polling at a given interval to continuously fetch data from the endpoint), it does seem to do what I intended. It reads the data from the endpoint and publishes the playback status to an MQTT endpoint, which I can then subscribe to in Home Assistant.

### To do / nice to have

* Maybe have some sort of scheduler in place, that for example only tells it to check the endpoint in the evening;
* Have a look at the other API endpoints for perhaps more interesting stuff.


## Getting started

### Install

Prerequisites: [Node.js](https://nodejs.org) >= 10.0

#### Docker

A `Dockerfile` is available that can be used to create a Docker image.

### Usage 

```
Usage: popcorn2mqtt [options]

Options:
  -p, --popcornhour     IP address or host name of the Popcorn Hour device
  -i, --interval        Sets the polling interval (ms)  [default: 1000]
  -h, --help            Show help  [boolean]
  -l, --logging         Logging level  [choices: "error", "warn", "info", "debug"] [default: "info"]
  -m, --mqtt            MQTT broker url. See https://github.com/mqttjs/MQTT.js#connect-using-a-url  [default: "mqtt://127.0.0.1"]
  -k, --insecure        Accept self singed-certificates when using TLS. See https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options  [boolean] [default: false]
  -n, --name            Instance name. Used as MQTT client ID and as topic prefix  [default: "popcorn-hour"]

```  

All config options can be set via environment variables also (uppercase, underscore).

#### MQTT URL

You can add Username/Password for the connection to the MQTT broker to the MQTT URL param like e.g. 
`mqtt://user:pass@broker`. For a secure connection via TLS use `mqtts://` as URL scheme.

