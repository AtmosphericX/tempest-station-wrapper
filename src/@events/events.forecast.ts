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

interface ForecastOptions {
    build_code: string
    client: {
        base_url: string
    }
    current_conditions: {
        air_density: number
        air_temperature: number
        brightness: number
        conditions: string
        delta_t: number
        dew_point: number
        feels_like: number
        icon: string
        includes_station_data: boolean
        is_precip_local_day_rain_check: boolean
        is_precip_local_yesterday_rain_check: boolean
        lightning_strike_count_last_1hr: number
        lightning_strike_count_last_3hr: number
        lightning_strike_last_distance: number
        lightning_strike_last_distance_msg: string
        lightning_strike_last_epoch: number
        precip_accum_local_day: number
        precip_accum_local_yesterday: number
        precip_minutes_local_day: number
        precip_minutes_local_yesterday: number
        precip_probability: number
        pressure_trend: 'falling' | 'rising' | 'steady'
        relative_humidity: number
        sea_level_pressure: number
        solar_radiation: number
        station_pressure: number
        time: number
        uv: number
        wet_bulb_globe_temperature: number
        wet_bulb_temperature: number
        wind_avg: number
        wind_direction: number
        wind_direction_cardinal: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'
        wind_direction_icon: string
        wind_gust: number
    }
    forecast: {
        daily: Record<string ,unknown>
        hourly: Record<string ,unknown>
    },
    latitude: number
    location_name: string
    longitude: number
    refresh_interval_seconds: number
    source_id: number
    source_id_conditions: number
    station: {
        agl: number
        elevation: number
        is_station_online: boolean
        network_data: []
        state: number
        station_id: number
    },
    status: { 
        status_code: number
        status_message: string 
    }
    timezone: string
    timezone_offset_minutes: number
    units: {
        units_air_density: string
        units_brightness: string
        units_distance: string
        units_other: string
        units_precip: string
        units_pressure: string
        units_solar_radiation: string
        units_temp: string
        units_wind: string
    },
    units_display: {
        units_air_density: string
        units_brightness: string
        units_distance: string
        units_other: string
        units_precip: string
        units_pressure: string
        units_solar_radiation: string
        units_temp: string
        units_wind: string
    }
}

   

export const forecast = (data: ForecastOptions): void => {
    setEventEmit({
        event: `onForecast`,
        metadata: {
            type: `Feature`,
            geometry: {
                type: `Point`,
                coordinates: [bootstrap.cache.longitude, bootstrap.cache.latitude]
            },
            properties: {
                ...data.current_conditions,
                station: data.location_name,
                elevation: data.station.elevation
            }
        },
    });
}