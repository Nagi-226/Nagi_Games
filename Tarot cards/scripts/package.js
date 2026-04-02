const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting packaging process...');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'tarot-app-release');

// 1. Create dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// 2. Copy server files
console.log('Copying server files...');
const serverDist = path.join(distDir, 'server');
fs.mkdirSync(serverDist);
fs.cpSync(path.join(rootDir, 'server', 'src'), path.join(serverDist, 'src'), { recursive: true });
fs.cpSync(path.join(rootDir, 'server', 'package.json'), path.join(serverDist, 'package.json'));

// 3. Copy client build
console.log('Copying client build...');
const clientDist = path.join(distDir, 'client');
fs.mkdirSync(clientDist);
fs.cpSync(path.join(rootDir, 'client', 'build'), path.join(clientDist, 'build'), { recursive: true });

// 4. Create a start script and package.json for the release
console.log('Creating root files...');
const releasePackage = {
  name: "tarot-app",
  version: "1.0.0",
  private: true,
  scripts: {
    "start": "cd server && npm start",
    "install:prod": "cd server && npm install --production"
  }
};
fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(releasePackage, null, 2));

const startScript = `
echo "Starting Tarot Application..."
echo "Initializing database..."
node server/src/database/init.js
echo "Starting server..."
node server/src/index.js
`;
fs.writeFileSync(path.join(distDir, 'start.bat'), startScript.trim());
fs.writeFileSync(path.join(distDir, 'start.sh'), startScript.trim());

console.log('Packaging complete! The app is ready in the "tarot-app-release" folder.');
console.log('To run the release:');
console.log('1. cd tarot-app-release');
console.log('2. npm run install:prod');
console.log('3. ./start.bat (Windows) or ./start.sh (Mac/Linux)');
