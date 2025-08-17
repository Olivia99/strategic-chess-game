#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Vercel build process...');
console.log('Current directory:', process.cwd());
console.log('Directory contents:', fs.readdirSync('.'));

const webAppPath = path.join(__dirname, 'apps', 'web');

if (!fs.existsSync(webAppPath)) {
  console.error('❌ apps/web directory not found!');
  process.exit(1);
}

console.log('📁 Found apps/web directory');
console.log('🔧 Installing dependencies...');

try {
  // Change to web app directory and install dependencies
  process.chdir(webAppPath);
  console.log('📦 Running npm install in apps/web...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🏗️ Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}