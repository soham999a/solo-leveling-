#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try different ways to run vite build
const vitePaths = [
  path.join(__dirname, 'node_modules', '.bin', 'vite'),
  path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js'),
  'vite'
];

function tryBuild(vitePath, index = 0) {
  if (index >= vitePaths.length) {
    console.error('All vite paths failed');
    process.exit(1);
  }

  console.log(`Trying to build with: ${vitePath}`);
  
  const child = spawn('node', [vitePath, 'build'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  child.on('error', (error) => {
    console.error(`Error with ${vitePath}:`, error.message);
    tryBuild(vitePaths[index + 1], index + 1);
  });

  child.on('exit', (code) => {
    if (code === 0) {
      console.log('Build successful!');
      process.exit(0);
    } else {
      console.error(`Build failed with code ${code} for ${vitePath}`);
      tryBuild(vitePaths[index + 1], index + 1);
    }
  });
}

tryBuild(vitePaths[0]);
