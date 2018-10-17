FROM node:10-slim
WORKDIR /app
COPY package.json /app
RUN npm ci
COPY . /app
CMD node index.js -p $P2M_POPCORN_HOUR_HOST -m $P2M_MQTT_BROKER -i $P2M_POLL_INTERVAL
