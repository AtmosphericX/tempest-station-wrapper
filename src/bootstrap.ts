/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                            
                                     |_|                                                                                                                

    Created with ♥ by the AtmosphericX Team (KiyoWx, StarflightWx, & CJ Ziegler)
    Discord: https://atmosphericx-discord.scriptkitty.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

    Internal Package: @atmosx/tempest-station-wrapper

*/

import { EventEmitter } from 'node:events';

export const bootstrap = {
    version: `2.0.02`,
    connecting: false,
    listener: new EventEmitter(),
    ratelimits: {},
    reconnect: null,
    delay: 5e3,
    socket: null,
    ansi_colors: {
        RED: `\x1b[31m`, GREEN: `\x1b[32m`, YELLOW: `\x1b[33m`,
        BLUE: `\x1b[34m`, MAGENTA: `\x1b[35m`, CYAN: `\x1b[36m`,
        WHITE: `\x1b[37m`, RESET: `\x1b[0m`
    },
    cache: {
        longitude: null,
        latitude: null,
        socket: `wss://ws.weatherflow.com/swd/data?api_key={KEY}&location_id={DEVICE}&ver=tempest-20250728`,
        station: `https://swd.weatherflow.com/swd/rest/stations/{STATION}?api_key={KEY}`,
        stations: `https://swd.weatherflow.com/swd/rest/map/stations?api_key={KEY}&build=160&limit=500&lat_min={LMIN}&lon_min={LOMIN}&lat_max={LMAX}&lon_max={LOMAX}&_={TIME}`,
        forecast: `https://swd.weatherflow.com/swd/rest/better_forecast?api_key={KEY}&station_id={STATION}&units_temp=f&units_wind=mph&units_pressure=inhg&units_distance=mi&units_precip=in&units_other=imperial&units_direction=mph`,
        directions: {
            N: [348.75, 360], NNE: [11.25, 33.75], NE: [33.75, 56.25],
            ENE: [56.25, 78.75], E: [78.75, 101.25], ESE: [101.25, 123.75],
            SE: [123.75, 146.25], SSE: [146.25, 168.75], S: [168.75, 191.25], SSW: [191.25, 213.75], SW: [213.75, 236.25],
            WSW: [236.25, 258.75], W: [258.75, 281.25], WNW: [281.25, 303.75],
            NW: [303.75, 326.25], NNW: [326.25, 348.75],
        }
    },
    settings: {
        APIKey: null,
        DeviceID: null,
        StationID: null,
        EnableJournal: true
    }
}