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

import { setEventEmit } from "../@utilities/utilities.setEventEmit";
import { bootstrap } from "../../bootstrap";
import ws from 'ws'


export const xMessages = async (): Promise<void> => {
    bootstrap.socket.on('message', (message: ws.Message) => {
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
}