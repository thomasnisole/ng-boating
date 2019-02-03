export const environment = {
  production: false,
  backendUrl: 'http://localhost:80/',
  defaultUserPreferences: {
    language: 'fr',
    port: null,
    baudRate: 4800,
  },
  baudRates: [4800, 9600, 19200, 38400],
  userPreferencesFileName: 'user-preferences.json',
  waypointsFileName: 'waypoints.json'
};
