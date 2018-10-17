export const environment = {
  production: true,
  backendUrl: 'http://localhost:80/',
  defaultUserPreferences: {
    language: 'fr',
    port: null,
    baudRate: 4800,
    waypointsFileName: 'waypoints.json'
  },
  baudRates: [4800, 9600, 19200, 38400]
};
