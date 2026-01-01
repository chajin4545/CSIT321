const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const frontendDir = path.resolve(__dirname, '..');
const prototypeDir = path.resolve(frontendDir, '../campus-buddy-fe');
const distDir = path.join(frontendDir, 'dist');
const prototypeDistDir = path.join(prototypeDir, 'dist');
const targetPrototypeDir = path.join(distDir, 'campus-buddy-fe');

function runCommand(command, cwd) {
  console.log(`Running: ${command} in ${cwd}`);
  execSync(command, { cwd, stdio: 'inherit', shell: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  // 1. Build Prototype
  console.log('--- Building Prototype ---');
  if (fs.existsSync(prototypeDir)) {
      // Check if node_modules exists, if not install
      // We force install if it's CI/Azure environment usually, but to be safe check for existence
      if (!fs.existsSync(path.join(prototypeDir, 'node_modules'))) {
          console.log('Installing prototype dependencies...');
          runCommand('npm install', prototypeDir);
      }
      // Or simply always install to ensure freshness in CI
      // runCommand('npm install', prototypeDir); 
      
      runCommand('npm run build', prototypeDir);
  } else {
      console.error('Prototype directory not found at ' + prototypeDir);
      process.exit(1);
  }

  // 2. Build Frontend
  console.log('--- Building Frontend ---');
  // Original build command: expo export --platform web --output-dir dist
  // Using npx to ensure local expo binary is used
  runCommand('npx expo export --platform web --output-dir dist', frontendDir);

  // 3. Move Prototype Build
  console.log('--- Integrating Prototype ---');
  if (fs.existsSync(prototypeDistDir)) {
    console.log(`Copying from ${prototypeDistDir} to ${targetPrototypeDir}`);
    copyDir(prototypeDistDir, targetPrototypeDir);
    console.log(`Copied prototype build successfully.`);
  } else {
    console.error('Prototype dist not found. Build failed?');
    process.exit(1);
  }

  console.log('--- Build Complete ---');

} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
