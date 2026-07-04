const { Manager } = require(`@atmosx/tempest-station-wrapper`);

const TempestStation = new Manager({
    APIKey: "<YOUR_API_KEY>",
    DeviceID: 0,
    StationID: 0,
    EnableJournal: true,
});

TempestStation.on(`onObservedObservation`, (data) => {
    console.log(data);
});
