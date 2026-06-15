type TypeSettings = {
    APIKey: string | null;
    DeviceID: number | null;
    StationID: number | null;
    EnableJournal: boolean;
};

declare class Manager {
    constructor(settings: TypeSettings);
    on(event: string, callback: () => void): void;
    trycatch(): void;
}

export { Manager };
