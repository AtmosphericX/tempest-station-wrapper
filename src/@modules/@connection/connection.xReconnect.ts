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
import { xDeploy } from "./connection.xDeploy";



export const xReconnect = (reason: string): Promise<void> => {
    if (bootstrap.reconnect) return;
    if (String(reason).includes(`429`)) { 
        bootstrap.delay = Math.min(bootstrap.delay * 2, 60e3);
    }
    bootstrap.reconnect = setTimeout(async () => {
        bootstrap.reconnect = null;
        await xDeploy();
    }, bootstrap.delay);
}