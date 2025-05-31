const fs = require('fs-extra');
const path = require('path');

async function build() {
  try {
    console.log('Starting build process...');
    
    // Ensure dist directory exists
    const distDir = path.join(__dirname, 'dist');
    console.log('Creating dist directory:', distDir);
    fs.ensureDirSync(distDir);
    
    // Ensure database directory exists in dist
    const distDatabaseDir = path.join(distDir, 'database');
    console.log('Creating database directory:', distDatabaseDir);
    fs.ensureDirSync(distDatabaseDir);
    
    // Copy SQL files
    const srcDatabaseDir = path.join(__dirname, 'src', 'database');
    console.log('Copying SQL files from:', srcDatabaseDir, 'to:', distDatabaseDir);
    
    // List files before copying
    const files = fs.readdirSync(srcDatabaseDir);
    console.log('Files found in source directory:', files);
    
    // Copy each SQL file
    for (const file of files) {
      if (file.endsWith('.sql')) {
        const srcPath = path.join(srcDatabaseDir, file);
        const destPath = path.join(distDatabaseDir, file);
        console.log(`Copying ${file} to dist...`);
        fs.copyFileSync(srcPath, destPath);
        console.log(`Successfully copied ${file}`);
      }
    }
    
    // Verify files were copied
    const copiedFiles = fs.readdirSync(distDatabaseDir);
    console.log('Files in dist/database after copy:', copiedFiles);
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 