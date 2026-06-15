var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/bootstrap.ts
import { EventEmitter } from "events";
var bootstrap = {
  version: `2.0.0`,
  connecting: false,
  listener: new EventEmitter(),
  ratelimits: {},
  reconnect: null,
  delay: 5e3,
  socket: null,
  ansi_colors: {
    RED: `\x1B[31m`,
    GREEN: `\x1B[32m`,
    YELLOW: `\x1B[33m`,
    BLUE: `\x1B[34m`,
    MAGENTA: `\x1B[35m`,
    CYAN: `\x1B[36m`,
    WHITE: `\x1B[37m`,
    RESET: `\x1B[0m`
  },
  cache: {
    longitude: null,
    latitude: null,
    socket: `wss://ws.weatherflow.com/swd/data?api_key={KEY}&location_id={DEVICE}&ver=tempest-20250728`,
    stations: `https://swd.weatherflow.com/swd/rest/stations/{STATION}?api_key={KEY}`,
    directions: {
      N: [348.75, 360],
      NNE: [11.25, 33.75],
      NE: [33.75, 56.25],
      ENE: [56.25, 78.75],
      E: [78.75, 101.25],
      ESE: [101.25, 123.75],
      SE: [123.75, 146.25],
      SSE: [146.25, 168.75],
      S: [168.75, 191.25],
      SSW: [191.25, 213.75],
      SW: [213.75, 236.25],
      WSW: [236.25, 258.75],
      W: [258.75, 281.25],
      WNW: [281.25, 303.75],
      NW: [303.75, 326.25],
      NNW: [326.25, 348.75]
    }
  },
  settings: {
    APIKey: null,
    DeviceID: null,
    StationID: null,
    EnableJournal: true
  }
};

// src/@modules/@utilities/utilities.setTimeoutAction.ts
var setTimeoutAction = (options) => {
  var _a, _b;
  let target = (_b = (_a = bootstrap) == null ? void 0 : _a.ratelimits) == null ? void 0 : _b[options == null ? void 0 : options.identifier];
  if (!target) {
    bootstrap.ratelimits[options == null ? void 0 : options.identifier] = [];
    target = bootstrap.ratelimits[options == null ? void 0 : options.identifier];
  }
  if ((target == null ? void 0 : target.length) > 0) {
    bootstrap.ratelimits[options == null ? void 0 : options.identifier] = target.filter((ts) => Date.now() - ts < (options == null ? void 0 : options.interval) * 1e3);
    target = bootstrap.ratelimits[options == null ? void 0 : options.identifier];
  }
  const oldestTimestamp = target == null ? void 0 : target[0];
  const getWait = oldestTimestamp ? Math.ceil((options == null ? void 0 : options.interval) * 1e3 - (Date.now() - oldestTimestamp)) : 0;
  const max = (options == null ? void 0 : options.max) || 1;
  if ((target == null ? void 0 : target.length) >= max && getWait > 0) {
    return {
      limited: true,
      remaining: getWait,
      response: `You are being rate limited, please wait ${(getWait / 1e3).toFixed(1)} second(s) before performing this action again.`
    };
  }
  bootstrap.ratelimits[options == null ? void 0 : options.identifier].push(Date.now());
  return { limited: false };
};

// src/@modules/@utilities/utilities.setWarning.ts
var setWarning = (options) => {
  var _a, _b;
  const settings = bootstrap.settings;
  bootstrap.listener.emit(`log`, `${(_a = options.title) != null ? _a : `[${bootstrap.ansi_colors.YELLOW}ATMOSX-PARSER${bootstrap.ansi_colors.RESET}]`} ${options.message}`);
  if (settings.EnableJournal) {
    console.log(`${(_b = options.title) != null ? _b : `[${bootstrap.ansi_colors.YELLOW}ATMOSX-PARSER${bootstrap.ansi_colors.RESET}]`} ${options.message}`);
  }
};

// src/@modules/@utilities/utilities.setEventEmit.ts
var setEventEmit = (options) => {
  if (options.limited) {
    const isTimeout = setTimeoutAction({ identifier: `event.${options.event}`, addTime: true, max: 1, interval: 1 });
    if (isTimeout.limited) return;
  }
  bootstrap.listener.emit(options.event, options.metadata);
  if (options.event != `log`) {
    bootstrap.listener.emit(`*`, { event: options.event, data: options.metadata });
  }
  if (options.message) {
    setWarning({ message: options.message });
  }
};

// src/@modules/@utilities/utilities.setSettings.ts
var setSettings = (newSettings) => {
  const settings = bootstrap.settings;
  const merge = (target, source) => {
    for (const key in source) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
      const srcVal = source[key];
      const tgtVal = target[key];
      if (srcVal && typeof srcVal === "object" && !Array.isArray(srcVal)) {
        if (!tgtVal || typeof tgtVal !== "object" || Array.isArray(tgtVal)) {
          target[key] = {};
        }
        merge(target[key], srcVal);
      } else {
        target[key] = srcVal;
      }
    }
  };
  merge(settings, newSettings);
  return settings;
};

// src/@modules/@connection/connection.xDeploy.ts
import ws from "ws";

// src/@modules/@utilities/utilities.createHttp.ts
import request from "request";
var createHttp = (options) => __async(null, null, function* () {
  return new Promise((resolve, reject) => {
    var _a, _b, _c, _d, _e;
    const requestOptions = {
      url: (_a = options.url) != null ? _a : `https://api.weather.gov/alerts/active`,
      headers: (_b = options.headers) != null ? _b : {
        "User-Agent": "AtmosphericX",
        "Accept": "application/geo+json, text/plain, */*; q=0.9",
        "Accept-Language": "en-US,en;q=0.9"
      },
      method: (_c = options.method) != null ? _c : `GET`,
      timeout: (_d = options.timeout) != null ? _d : 1e4,
      proxy: (_e = options.proxy) != null ? _e : null,
      maxRedirects: 1
    };
    if (options.formData) {
      requestOptions["formData"] = options.formData;
    } else if (options.body) {
      requestOptions["body"] = options.body;
    }
    request(requestOptions, (error, response, body) => {
      var _a2, _b2, _c2, _d2, _e2;
      if (error) {
        return resolve({
          error: true,
          options: requestOptions,
          status: -1,
          message: (_a2 = error.message) != null ? _a2 : `Unknown Error`
        });
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return resolve({
          error: true,
          options: requestOptions,
          status: (_b2 = response.statusCode) != null ? _b2 : -1,
          message: `HTTP Status Code ${(_c2 = response.statusCode) != null ? _c2 : `Unknown Status Code`} (${body})`
        });
      }
      if (body == void 0 || body == null) {
        return resolve({
          error: true,
          options: requestOptions,
          status: (_d2 = response.statusCode) != null ? _d2 : -1,
          message: `Empty Response Body`
        });
      }
      resolve({
        error: false,
        options: requestOptions,
        status: (_e2 = response.statusCode) != null ? _e2 : -1,
        message: body
      });
    });
  });
});

// src/@modules/@connection/connection.xDeploy.ts
var xDeploy = () => __async(null, null, function* () {
  const settings = bootstrap.settings;
  if (!(settings == null ? void 0 : settings.APIKey) || !(settings == null ? void 0 : settings.DeviceID) || (settings == null ? void 0 : settings.DeviceID) == 0 && (settings == null ? void 0 : settings.StationID) == 0) {
    setEventEmit({
      event: `onTempestStation`,
      metadata: {
        message: `Invalid settings provided, please make sure you have provided valid APIKey, DeviceID, and StationID.`,
        data: {},
        type: `error`,
        error: true
      },
      message: `Invalid settings provided, please make sure you have provided valid APIKey, DeviceID, and StationID.`
    });
    return;
  }
  bootstrap.socket = new ws(bootstrap.cache.socket.replace("{KEY}", settings.APIKey).replace("{DEVICE}", settings.DeviceID.toString()));
  bootstrap.socket.on("open", () => __async(null, null, function* () {
    var _a;
    setEventEmit({
      event: `onTempestStation`,
      metadata: {
        message: `WebSocket connection established.`,
        data: {},
        type: `online`,
        error: false
      },
      message: `WebSocket connection established.`
    });
    if (settings == null ? void 0 : settings.StationID) {
      const station = yield createHttp({
        url: bootstrap.cache.stations.replace("{STATION}", String(settings.StationID)).replace("{KEY}", settings.APIKey),
        headers: {
          "User-Agent": "@atmosx/tempest-station-wrapper",
          "Accept": "application/geo+json, text/plain, */*; q=0.9",
          "Accept-Language": "en-US,en;q=0.9"
        }
      });
      if (!station.error) {
        const data = station.message;
        const s1 = (_a = data.stations) == null ? void 0 : _a[0];
        bootstrap.cache.longitude = Number(s1 == null ? void 0 : s1.longitude);
        bootstrap.cache.latitude = Number(s1 == null ? void 0 : s1.latitude);
      }
      if (bootstrap.socket) {
        if (Number.isFinite(bootstrap.cache.longitude) && Number.isFinite(bootstrap.cache.latitude)) {
          bootstrap.socket.send(JSON.stringify({
            type: "geo_strike_listen_start",
            lat_min: bootstrap.cache.latitude - 5,
            lat_max: bootstrap.cache.latitude + 5,
            lon_min: bootstrap.cache.longitude - 5,
            lon_max: bootstrap.cache.longitude + 5
          }));
        }
        bootstrap.socket.send(JSON.stringify({
          type: "listen_start",
          device_id: settings.DeviceID
        }));
        bootstrap.socket.send(JSON.stringify({
          type: "listen_rapid_start",
          device_id: settings.DeviceID
        }));
      }
    }
  }));
});

// src/@modules/@connection/connection.xReconnect.ts
var xReconnect = (reason) => {
  if (bootstrap.reconnect) return;
  if (String(reason).includes(`429`)) {
    bootstrap.delay = Math.min(bootstrap.delay * 2, 6e4);
  }
  bootstrap.reconnect = setTimeout(() => __async(null, null, function* () {
    bootstrap.reconnect = null;
    yield xDeploy();
  }), bootstrap.delay);
};

// src/@modules/@connection/connection.xError.ts
var xError = () => __async(null, null, function* () {
  bootstrap.socket.on("error", (error) => {
    setEventEmit({
      event: `onTempestStation`,
      metadata: {
        message: `WebSocket connection error.`,
        data: {},
        type: `error`,
        error: true
      },
      message: `WebSocket closed unexpectedly, Attemtping to reconnect...`
    });
    bootstrap.socket.close();
    bootstrap.socket = null;
    bootstrap.reconnect = null;
    bootstrap.connecting = false;
    return xReconnect(error);
  });
});

// src/@modules/@connection/connection.xMessages.ts
var xMessages = () => __async(null, null, function* () {
  bootstrap.socket.on("message", (message) => {
    const data = JSON.parse(message.toString());
    switch (data.type) {
      case `ack`:
        console.log(`ACK: ${JSON.stringify(data)}`);
        break;
      case `obs_st`:
        console.log(`Observation: ${JSON.stringify(data)}`);
        break;
      case `rapid_wind`:
        console.log(`Rapid Wind: ${JSON.stringify(data)}`);
        break;
      case `evt_strike`:
        console.log(`Event Strike: ${JSON.stringify(data)}`);
        break;
      default:
    }
  });
});

// src/@core/core.start.ts
var startService = (configurations) => __async(null, null, function* () {
  if (bootstrap.connecting) return;
  bootstrap.connecting = true;
  setSettings(configurations);
  yield xDeploy();
  yield xError();
  yield xMessages();
});

// src/@modules/@utilities/utilities.setListener.ts
var setListener = (options) => {
  bootstrap.listener.on(options.event, options.callback);
  return () => {
    void bootstrap.listener.off(options.event, options.callback);
  };
};

// src/@core/core.createListener.ts
var createListener = (event, callback) => {
  setListener({ event, callback });
};

// src/index.ts
var Manager = class {
  constructor(settings) {
    this.trycatch();
    startService(settings);
  }
  on(event, callback) {
    createListener(event, callback);
  }
  trycatch() {
    process.on("uncaughtException", (err) => {
      var _a;
      const ignored = ["ETIMEDOUT", "ECONNRESET", "EHOSTUNREACH", "ENOTFOUND", "ECONNREFUSED", "EPIPE", "EADDRINUSE", "EALREADY", "EACCES", "EAGAIN", "EHOSTDOWN", "STARTTLS_FAILURE"];
      if (ignored.includes(err == null ? void 0 : err.code)) {
        setEventEmit({
          event: `onTempestStation`,
          metadata: {
            message: `Tempest Critical Error: ${(_a = err == null ? void 0 : err.code) != null ? _a : "Unknown error code"}. This may indicate a connection issue.`,
            data: {},
            type: `error`,
            error: true
          }
        });
        return;
      }
      setWarning({ message: `Uncaught Exception: ${err instanceof Error ? err.stack || err.message : String(err)}` });
    });
  }
};
export {
  Manager
};
