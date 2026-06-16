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

interface WindOptions { 
    device_id: number
    serial_number: string
    hub_sn: string
    type: string
    ob: [number, number, number]
}

export const wind = (data: WindOptions): void => {
    setEventEmit({
        event: `onObservedWind`,
        metadata: {
            type: `Feature`,
            geometry: {
                type: `Point`,
                coordinates: [bootstrap.cache.longitude, bootstrap.cache.latitude]
            },
            properties: {
                device_id: data.device_id,
                serial_number: data.serial_number,
                hub_sn: data.hub_sn,
                time: data.ob?.[0],
                wind: data.ob?.[1],
                direction: bootstrap.cache.directions ? Object.keys(bootstrap.cache.directions).find(key => {
                    const [min, max] = bootstrap.cache.directions[key as keyof typeof bootstrap.cache.directions];
                    return min <= data.ob?.[2] && data.ob?.[2] < max;
                }) : `N`,
            }
        },
    });

}