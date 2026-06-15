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

import { bootstrap } from "../bootstrap"
import { setWarning } from "../@modules/@utilities/utilities.setWarning";
import { createHttp } from "../@modules/@utilities/utilities.createHttp";
import { setSettings } from "../@modules/@utilities/utilities.setSettings";
import { startService } from "./core.start";
import { stopService } from "./core.stop";

interface GetClosestStationOptions {
    latitude: number;
    longitude: number;
}

export const getClosestStation = async (options: GetClosestStationOptions) => {
    if (!Number.isFinite(options.latitude) || !Number.isFinite(options.longitude)) {
        setWarning({ message: `Invalid latitude or longitude provided.` });
    }
    console.log( bootstrap.cache.stations
            .replace('{KEY}', bootstrap.settings.APIKey)
            .replace('{LMIN}', String(options.latitude - 5))
            .replace('{LOMIN}', String(options.longitude - 5))
            .replace('{LMAX}', String(options.latitude + 5))
            .replace('{LOMAX}', String(options.longitude + 5))
            .replace('{TIME}', String(Date.now())))
    const response = await createHttp({
        url: bootstrap.cache.stations
            .replace('{KEY}', bootstrap.settings.APIKey)
            .replace('{LMIN}', String(options.latitude - 5))
            .replace('{LOMIN}', String(options.longitude - 5))
            .replace('{LMAX}', String(options.latitude + 5))
            .replace('{LOMAX}', String(options.longitude + 5))
            .replace('{TIME}', String(Date.now())),
        headers: {
            "User-Agent": "@atmosx/tempest-station-wrapper",
            "Accept": "application/geo+json, text/plain, */*; q=0.9",
            "Accept-Language": "en-US,en;q=0.9"
        }
    });
    if (!response.error) { 
        const data = JSON.parse(response.message);
        const features = Array.isArray(data?.features) ? data.features : []
        const toRad = (degrees: number) => degrees * (Math.PI / 180);
        const earthRadiusKm = 6371
        const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const dLat = toRad(lat2 - lat1)
            const dLon = toRad(lon2 - lon1)
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) *
                    Math.cos(toRad(lat2)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2)
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            return earthRadiusKm * c
        }
        let minDistance = Infinity;
        let closestStation = null;
        for (const feature of features) {
            const { geometry, properties, id } = feature;
            if (geometry?.type === "Point" && Array.isArray(geometry.coordinates)) {
                const [lon, lat] = geometry.coordinates;
                const distance = haversine(options.latitude, options.longitude, lat, lon);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestStation = { ...properties, id };
                }
            }
        }
        if (closestStation) {
            setSettings({ DeviceID: closestStation.devices[0], StationID: closestStation.id });
            stopService();
            setTimeout(() => { startService(bootstrap.settings); }, 1e3);
        }
        return closestStation;
    }
    return null;
}