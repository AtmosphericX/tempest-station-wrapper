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


import { TypeSettings } from "../../@types/types.settings";
import { bootstrap } from "../../bootstrap";
import { createHttp } from "../@utilities/utilities.createHttp";
import { xReconnect } from "./connection.xReconnect";
import { setEventEmit } from "../@utilities/utilities.setEventEmit";
import ws from 'ws'



export const xDeploy = async (): Promise<void> => {
    const settings = bootstrap.settings as TypeSettings;
    if (!settings?.APIKey || !settings?.DeviceID || settings?.DeviceID == 0 && settings?.StationID == 0) {
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
        await xReconnect(`Invalid settings provided, please make sure you have provided valid APIKey, DeviceID, and StationID.`);
    }
    bootstrap.socket = new ws(bootstrap.cache.socket.replace('{KEY}', settings.APIKey).replace('{DEVICE}', settings.DeviceID.toString()));
    bootstrap.socket.on('open', async () => {
        setEventEmit({
            event: `onTempestStation`,
            metadata: {
                message: `WebSocket connection established (@${settings.DeviceID}/${settings.StationID})`,
                data: {},
                type: `online`,
                error: false
            },
            message: `WebSocket connection established (@${settings.DeviceID}/${settings.StationID})`
        });

        if (settings?.StationID) {
            const station = await createHttp({
                url: bootstrap.cache.station.replace('{STATION}', String(settings.StationID)).replace('{KEY}', settings.APIKey),
                headers: {
                    "User-Agent": "@atmosx/tempest-station-wrapper",
                    "Accept": "application/geo+json, text/plain, */*; q=0.9",
                    "Accept-Language": "en-US,en;q=0.9"
                }
            })
            if (!station.error) { 
                const data = JSON.parse(station.message);
                const s1 = data.stations?.[0];
                bootstrap.cache.longitude = Number(s1?.longitude);
                bootstrap.cache.latitude = Number(s1?.latitude);
            }
            if (bootstrap.socket) { 
                if (Number.isFinite(bootstrap.cache.longitude) && Number.isFinite(bootstrap.cache.latitude)) {
                    bootstrap.socket.send(JSON.stringify({
                        type: "geo_strike_listen_start",
                        lat_min: bootstrap.cache.latitude - 5, lat_max: bootstrap.cache.latitude + 5,
                        lon_min: bootstrap.cache.longitude - 5, lon_max: bootstrap.cache.longitude + 5
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
    });
}