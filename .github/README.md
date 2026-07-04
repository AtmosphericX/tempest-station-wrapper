# Project AtmosphericX - Tempest Station Wrapper (v2.0.0)

<div align="center">
	<div align="center" style="border: none;">
		<img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/AtmosphericX/tempest-station-wrapper">
		<img alt="GitHub forks" src="https://img.shields.io/github/forks/AtmosphericX/tempest-station-wrapper">
		<img alt="GitHub issues" src="https://img.shields.io/github/issues/AtmosphericX/tempest-station-wrapper">
		<img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/AtmosphericX/tempest-station-wrapper">
	</div>
</div>

## What is `@atmosx/tempest-station-wrapper`
This repository provides a robust solution for interacting with the Tempest Weather Station. It enables seamless data retrieval using the device ID, including identifying the nearest station ID. With this project, you can access a wide range of weather related data such as temperature, humidity, pressure, wind gusts, and more. See [Documentation](https://atmosphericx.scriptkitty.cafe).

## Installation (NPM)
```bash
npm install @atmosx/tempest-station-wrapper
```

## Configurations & Usage
```ts
const { Manager } = require(`@atmosx/tempest-station-wrapper`); // CJS
import { Manager } from `@atmosx/tempest-station-wrapper`; // ESM

const TempestStation = new Manager({
    APIKey: "<YOUR_API_KEY>",
    DeviceID: 0,
    StationID: 0,
    EnableJournal: true,
});
```

### General Settings
- `APIKey`: Your API key for accessing the Tempest Weather Station API. (Required)
- `DeviceID`: The ID of the device you want to interact with. (Required + Can't be 0)
- `StationID`: The ID of the station you want to interact with. (Not required)
- `EnableJournal`: Whether to output logs without requiring event `listeners`.


## Events and Listeners

### Event `*`
Triggers for every event and product received by the manager. This is useful if you want to handle all events with a single listener.
```ts
Client.on(`*`, (data: any) => {
   	/*
		event: string
		data: object
	*/
})
```

### Event `onTempestStation`
Triggers when an update to the websocket is received. This will include a log to journal as well.
```ts
Client.on(`onTempestStation`, (data: any) => {
   	/*
		message: string,
		data: object,
		type: string,
		error: boolean
	*/
})
```

### Event `onObservedWind`
Triggers when a new wind data is received.
```ts
Client.on(`onObservedWind`, (data: any) => {
   	/*
		type: string,
		geometry: { type: string, coordinates: [number, number] },
		properties: {
			device_id: string,
			serial_number: string,
			hub_sn: string,
			time: number,
			wind: number,
			direction: string
		}
	*/
})
```


### Event `onForecast`
Triggers when a new forecast is received.
```ts
Client.on(`onForecast`, (data: any) => {
   	/*
		type: string,
		geometry: { type: string, coordinates: [ number, number ] },
		properties: {
			air_density: number,
			air_temperature: number,
			brightness: number,
			conditions: string,
			delta_t: number,
			dew_point: number,
			feels_like: number,
			icon: string,
			includes_station_data: boolean,
			is_precip_local_day_rain_check: boolean,
			is_precip_local_yesterday_rain_check: boolean,
			lightning_strike_count_last_1hr: number,
			lightning_strike_count_last_3hr: number,
			lightning_strike_last_distance: number,
			lightning_strike_last_distance_msg: string,
			lightning_strike_last_epoch: number,
			precip_accum_local_day: number,
			precip_accum_local_yesterday: number,
			precip_minutes_local_day: number,
			precip_minutes_local_yesterday: number,
			precip_probability: number,
			pressure_trend: 'falling',
			relative_humidity: number,
			sea_level_pressure: number,
			solar_radiation: number,
			station_pressure: number,
			time: number,
			uv: number,
			wet_bulb_globe_temperature: number,
			wet_bulb_temperature: number,
			wind_avg: number,
			wind_direction: number,
			wind_direction_cardinal: string,
			wind_direction_icon: string,
			wind_gust: number,
			station: string,
			elevation: number
		}
	*/
})
```

### Event `onObservation`
Triggers when new observations are received.
```ts
Client.on(`onObservation`, (data: any) => {
   	/*
		type: string,
		geometry: { type: string, coordinates: [ number, number ] },
		properties: {
			pressure_trend: string,
			strike_count_1h: number,
			strike_count_3h: number,
			precip_total_1h: number,
			strike_last_dist: number,
			strike_last_epoch: number,
			precip_accum_local_yesterday: number,
			precip_accum_local_yesterday_final: number,
			precip_analysis_type_yesterday: number,
			feels_like: number,
			heat_index: number,
			wind_chill: number,
			dew_point: number,
			wet_bulb_temperature: number,
			wet_bulb_globe_temperature: number,
			air_density: number,
			delta_t: number,
			precip_minutes_local_day: number,
			precip_minutes_local_yesterday: number,
			observation: {
				time: number,
				wind_average: number,
				wind: number,
				direction: string,
				temperature: number,
				humidity: number
			}
		}
	*/
})
```

### Event `onObservedLightning`
Triggers when a new lightning observation is received.
```ts
Client.on(`onObservedLightning`, (data: any) => {
   	/*
		type: string,
		geometry: { type: string, coordinates: [ number, number ] },
		properties: {
			time: number,
			distance: number,
			energy: number
		}
	*/
})
```

### Function `stopService`
Stops the service and closes the connection to the Tempest station.
```ts
import { stopService } from '@atmosx/tempest-station-wrapper';
stopService();
```

### Function `startService`
Starts the service and opens the connection to the Tempest station.
```ts
import { startService } from '@atmosx/tempest-station-wrapper';
startService();
```

### Function `getClosestStation`
Returns and sets the closest Tempest station to the given coordinates.
```ts
import { getClosestStation } from '@atmosx/tempest-station-wrapper';
const closestStation = getClosestStation([longitude, latitude]);
```

## References
[Tempest Weather Station](https://shop.tempest.earth/products/tempest) |
[Documentation](https://atmosphericx.scriptkitty.cafe/documentation) |
[Discord Server](https://atmosphericx-discord.scriptkitty.cafe) |
[Project Board](https://github.com/users/AtmosphericX/projects/2) |\
[Code of Conduct](/.github/CODE_OF_CONDUCT.md) |
[Contributing](/.github/CONTRIBUTING.md) |
[License](/.github/LICENSE) | 
[Security](/.github/SECURITY.md) | 

## Acknowledgements
- [k3yomi](https://github.com/k3yomi)