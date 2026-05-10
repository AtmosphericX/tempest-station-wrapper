/*
                                            _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                                 
                                     |_|                                                                                                                
    
    Written by: k3yomi@GitHub                        
*/


import * as fs from 'fs';
import * as path from 'path';
import * as events from 'events';
import * as jobs from 'croner';
import ws from 'ws';

export const packages = {
    fs, 
    path, 
    events, 
    jobs, 
    crypto, 
    ws
};

export const cache = {
    events: new events.EventEmitter(),
    lastWarn: null,
    isReady: true,
};

export const settings = { 
    api: null,
    deviceId: null,
    stationId: null,
    journal: true,
};

export const definitions = {
    messages: {
        client_stopped: `Disconnected from Tempest Weather Station.`,
        websocket_closed: `Connection to Tempest Weather Station closed unexpectedly, attempting to reconnect...`,
        websocket_established: `Successfully connected to Tempest Weather Station.`,
        forecast_fetch_error: `Please make sure you have a valid station ID`,
    },
    cardinal_direction_degrees: {
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
        NNW: [326.25, 348.75],
    },
};