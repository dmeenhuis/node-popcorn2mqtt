import fetch from 'node-fetch';
import log from 'yalm';
import mqtt from 'mqtt';
import xmlParser from 'fast-xml-parser';
import { from, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

function poll(fetchFn, isSuccessFn, pollInterval) {
  return interval(pollInterval).pipe(
      switchMap(() => from(fetchFn())),
      takeWhile((response) => isSuccessFn(response))
  );
}

import config from './config.js';

// http://192.168.1.150:8008/playback?arg0=get_current_vod_info

(async () => {
  log.setLevel(config.logging);

  const playbackVodUrl = `http://${config.popcornhour}:8008/playback?arg0=get_current_vod_info`;

  poll(
    () =>
      fetch(playbackVodUrl)
        .then(res => res.text())
        .then(body => xmlParser.parse(body)),
    () => true,
    5000
  ).subscribe(data => {
    if (!data) return;

    console.log(data);
  })
})();
