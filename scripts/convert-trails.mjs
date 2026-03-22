#!/usr/bin/env node
// Converts all .gpx files in the repo root to GeoJSON in public/trails/
// Usage: npm run convert-trails

import pkg from '@mapbox/togeojson';
const { gpx } = pkg;
import { DOMParser } from '@xmldom/xmldom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir  = path.join(rootDir, 'public/trails');

fs.mkdirSync(outDir, { recursive: true });

const gpxFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.gpx'));

if (gpxFiles.length === 0) {
  console.log('No .gpx files found in repo root.');
  process.exit(0);
}

for (const file of gpxFiles) {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const dom     = new DOMParser().parseFromString(content, 'text/xml');
  const geojson = gpx(dom);

  const slug = file
    .replace(/\.gpx$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const outPath = path.join(outDir, `${slug}.geojson`);
  fs.writeFileSync(outPath, JSON.stringify(geojson, null, 2));
  console.log(`✓  ${file}`);
  console.log(`   → public/trails/${slug}.geojson`);
}
