const fs = require('fs');
const path = require('path');

function appendWithHeader(filePath, header, line) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, header + '\n');
  }
  fs.appendFileSync(filePath, line);
}

module.exports = {
  e2e: {
    baseUrl: null,
    defaultCommandTimeout: 15000,
    video: false,
    setupNodeEvents(on, config) {
      on('task', {
        appendCsv(line) {
          const file = path.join(__dirname, 'dashboard', 'history.csv');
          const header = 'timestamp,url,status,duration_ms,group';
          appendWithHeader(file, header, line);
          return null;
        }
      });
      return config;
    },
    experimentalRunAllSpecs: true
  },
  env: {
    // HTTP status codes considered "up" (edit as needed):
    okStatuses: [200, 201, 202, 204, 301, 302, 303, 304, 307, 308],
    // Request timeout (ms)
    requestTimeout: 15000
  }
}