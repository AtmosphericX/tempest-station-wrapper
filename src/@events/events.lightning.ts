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

import { setEventEmit } from '../@modules/@utilities/utilities.setEventEmit'
import { bootstrap } from '../bootstrap';



interface LightningOptions {
    serial_number: string
    type: string
    hub_sn: string
    evt: [number, number, number, number]
    source: string
    device_id: number
}

export const lightning = (data: LightningOptions): void => {
    setEventEmit({
        event: `onObservedLightning`,
        metadata: {
            type: `Feature`,
            geometry: {
                type: `Point`,
                coordinates: [bootstrap.cache.longitude, bootstrap.cache.latitude]
            },
            properties: {
                time: data.evt?.[0],
                distance: parseFloat((data.evt?.[1] / 0.621371).toFixed(2)),
                energy: data.evt?.[2],
            }
        },
    });
}