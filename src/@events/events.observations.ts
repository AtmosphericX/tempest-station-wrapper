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

interface ObservationsOptions { 
    status: {
        status_code: number
        status_message: string
    }
    device_id: number
    type: string
    summary: {
        pressure_trend: string
        strike_count_1h: number
        strike_count_3h: number
        precip_total_1h: number
        strike_last_dist: number
        strike_last_epoch: number
        precip_accum_local_yesterday: number
        precip_accum_local_yesterday_final: number
        precip_analysis_type_yesterday: number
        feels_like: number
        heat_index: number
        wind_chill: number
        dew_point: number
        wet_bulb_temperature: number
        wet_bulb_globe_temperature: number
        air_density: number
        delta_t: number
        precip_minutes_local_day: number
        precip_minutes_local_yesterday: number
    }
    obs: [number[]]
}

export const observations = (data: ObservationsOptions): void => {
    setEventEmit({
        event: `onObservation`,
        metadata: {
            type: `Feature`,
            geometry: {
                type: `Point`,
                coordinates: [bootstrap.cache.longitude, bootstrap.cache.latitude]
            },
            properties: {
                ...data.summary,
                observation: {
                    time: data.obs[0][0],
                    wind_average: parseFloat((data.obs[0][2] * 2.23694).toFixed(2)),
                    wind: parseFloat((data.obs[0][3] * 2.23694).toFixed(2)),
                    direction: bootstrap.cache.directions ? Object.keys(bootstrap.cache.directions).find(dir => {
                        const [min, max] = bootstrap.cache.directions[dir as keyof typeof bootstrap.cache.directions];
                        return data.obs[0][4] >= min && data.obs[0][4] < max;
                    }) : `N`,
                    temperature: parseFloat(((data.obs[0][7] * 9/5) + 32).toFixed(2)),
                    humidity: data.obs[0][8],
                }
            }
        },
    });
}