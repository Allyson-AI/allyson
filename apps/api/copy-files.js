// copy-files.js
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'src/controllers/v1/sessions');
const destDir = path.join(__dirname, 'dist/controllers/v1/sessions');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(sourceDir).forEach(file => {
  if (file.endsWith('.yaml')) {
    fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, file));
  }
});