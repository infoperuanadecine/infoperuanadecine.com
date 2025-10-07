#!/usr/bin/env node

console.log('🔍 Checking Development Environment...\n');

// Check Node.js version
const nodeVersion = process.version;
const requiredNodeVersion = 'v18.0.0';

console.log(`📦 Node.js Version: ${nodeVersion}`);
if (nodeVersion >= requiredNodeVersion) {
  console.log('✅ Node.js version is compatible\n');
} else {
  console.log(`❌ Node.js version ${requiredNodeVersion}+ required\n`);
  process.exit(1);
}

// Check if essential files exist
const fs = require('fs');
const path = require('path');

const essentialFiles = [
  'package.json',
  'frontend/package.json',
  'vercel.json',
  'api/movies.ts'
];

console.log('📁 Checking Project Files:');
let allFilesExist = true;

essentialFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some essential files are missing. Please check your project structure.');
  process.exit(1);
}

// Check environment variables
console.log('\n🔐 Environment Variables:');
const envFile = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envFile)) {
  console.log('✅ .env.local file exists');
  const envContent = fs.readFileSync(envFile, 'utf8');
  
  if (envContent.includes('MONGODB_URI=')) {
    console.log('✅ MongoDB URI configured');
  } else {
    console.log('⚠️  MongoDB URI not configured');
  }
  
  if (envContent.includes('TMDB_API_KEY=')) {
    console.log('✅ TMDb API Key configured');
  } else {
    console.log('⚠️  TMDb API Key not configured');
  }
} else {
  console.log('⚠️  .env.local file not found. Create it with MongoDB URI and TMDb API Key');
}

// Check dependencies
console.log('\n📦 Dependencies:');
const rootNodeModules = path.join(process.cwd(), 'node_modules');
const frontendNodeModules = path.join(process.cwd(), 'frontend', 'node_modules');

if (fs.existsSync(rootNodeModules)) {
  console.log('✅ Root dependencies installed');
} else {
  console.log('❌ Root dependencies missing - run: npm install');
}

if (fs.existsSync(frontendNodeModules)) {
  console.log('✅ Frontend dependencies installed');
} else {
  console.log('❌ Frontend dependencies missing - run: cd frontend && npm install');
}

console.log('\n🚀 Ready to start development!');
console.log('Run: npm run dev:full');
console.log('\nThis will start:');
console.log('- Frontend: http://localhost:3000 (with live reload)');
console.log('- Serverless API: http://localhost:3001');
console.log('- Any changes will automatically refresh the browser');