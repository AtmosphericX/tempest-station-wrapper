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

import { bootstrap } from "../../bootstrap";
import { wind } from '../../@events/events.wind'
import { observations } from "../../@events/events.observations";
import { lightning } from "../../@events/events.lightning";
import { forecast } from "../../@events/events.forecast"
import { createHttp } from "../@utilities/utilities.createHttp";
import ws from 'ws'

export const xMessages = async (): Promise<void> => {
    if (!bootstrap.socket) return;
    bootstrap.socket.on('message', async (message: ws.Message) => {
        const data = JSON.parse(message.toString());
        switch (data.type) { 
            case `obs_st`:
                observations(data);
                const response = await createHttp({
                    url: bootstrap.cache.forecast.replace('{KEY}', bootstrap.settings.APIKey).replace('{STATION}', bootstrap.settings.StationID),
                    headers: {
                        "User-Agent": "@atmosx/tempest-station-wrapper",
                        "Accept": "application/geo+json, text/plain, */*; q=0.9",
                        "Accept-Language": "en-US,en;q=0.9"
                    }
                });
                if (!response.error) { forecast(JSON.parse(response.message)); }
                break;
            case `rapid_wind`:
                wind(data);
                break;
            case `evt_strike`:
                lightning(data);
                break;
            default:
        }
    });
}