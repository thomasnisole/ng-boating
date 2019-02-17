export const environment = {
  production: true,
  defaultUserPreferences: {
    language: 'fr',
    port: null,
    baudRate: 4800,
  },
  baudRates: [4800, 9600, 19200, 38400],
  userPreferencesFileName: 'user-preferences.json',
  waypointsFileName: 'waypoints.json'
};
