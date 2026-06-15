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


import { TypeSettings } from "../@types/types.settings";
import { setSettings } from "../@modules/@utilities/utilities.setSettings";
import { bootstrap } from "../bootstrap";
import { xDeploy } from "../@modules/@connection/connection.xDeploy"
import { xError } from "../@modules/@connection/connection.xError"
import { xMessages } from "../@modules/@connection/connection.xMessages";


export const startService = async (configurations: TypeSettings) => {
    if (bootstrap.connecting) return;
    bootstrap.connecting = true;
    setSettings(configurations) as TypeSettings;
    await xDeploy();
    await xError();
    await xMessages();
}