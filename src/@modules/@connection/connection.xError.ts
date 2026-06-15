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
import { xReconnect } from "./connection.xReconnect";
import ws from 'ws'

export const xError = async (): Promise<void> => {
    bootstrap.socket.on('error', (error: ws.Error) => {
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
}