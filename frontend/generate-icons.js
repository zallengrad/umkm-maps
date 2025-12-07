// Script to generate PWA icons from logo.png
// Run with: node generate-icons.js

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, 'public', 'logo.png');
const outputDir = path.join(__dirname, 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Generating PWA icons from logo.png...\n');

async function generateIcons() {
  try {
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputFile);
      
      console.log(`✅ Generated: icon-${size}x${size}.png`);
    }
    
    console.log('\n🎉 All icons generated successfully!');
    console.log(`📁 Icons saved to: ${outputDir}`);
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();
