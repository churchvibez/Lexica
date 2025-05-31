const fs = require('fs-extra');
const path = require('path');

// Ensure dist directory exists
fs.ensureDirSync(path.join(__dirname, 'dist'));

// Copy SQL files
fs.copySync(
  path.join(__dirname, 'src', 'database'),
  path.join(__dirname, 'dist', 'database'),
  { filter: (src) => src.endsWith('.sql') }
);

console.log('SQL files copied to dist directory'); 