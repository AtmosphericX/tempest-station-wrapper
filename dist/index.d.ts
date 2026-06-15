type TypeSettings = {
    APIKey?: string | null;
    DeviceID?: number | null;
    StationID?: number | null;
    EnableJournal?: boolean;
};

declare const startService: (configurations: TypeSettings) => Promise<void>;

declare const stopService: () => Promise<void>;

interface GetClosestStationOptions {
    latitude: number;
    longitude: number;
}
declare const getClosestStation: (options: GetClosestStationOptions) => Promise<any>;

declare class Manager {
    constructor(settings: TypeSettings);
    on(event: string, callback: () => void): void;
    trycatch(): void;
}

export { Manager, Manager as default, getClosestStation, startService, stopService };
