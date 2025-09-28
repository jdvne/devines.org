/* eslint-env node */
const asciifyImage = require('asciify-image');

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/*
 * NOTE: requires ffmpeg to be installed and in PATH
 * e.g. `brew install ffmpeg` on macOS
 * or `sudo apt install ffmpeg` on Debian/Ubuntu
 */

async function run() {
  const input = process.argv[2]; // e.g. ./videos/myclip.mp4
  const fps = Number(process.argv[3] || 8); // desired fps
  const width = Number(process.argv[4] || 120); // ascii width
  if (!input) {
    console.error('Usage: node asciify-video.js <input-video> [fps] [width]');
    process.exit(1);
  }

  const name = path.basename(input, path.extname(input));
  const outDir = path.join(__dirname, '..', 'public', 'assets', 'videos', name);
  const framesDir = path.join(outDir, 'frames_png');
  const asciiDir = path.join(outDir, 'frames_txt');

  fs.mkdirSync(framesDir, { recursive: true });
  fs.mkdirSync(asciiDir, { recursive: true });

  // extract frames with ffmpeg
  // -hide_banner suppresses verbose ffmpeg header
  // Format: frame_00001.png ...
  console.log('Extracting frames with ffmpeg...');
  execSync(
    `ffmpeg -hide_banner -loglevel error -i "${input}" -vf fps=${fps} "${path.join(framesDir, 'frame_%05d.png')}"`,
    { stdio: 'inherit' }
  );

  // read and sort frame files
  const pngFiles = fs.readdirSync(framesDir).filter(f => f.endsWith('.png')).sort();
  if (pngFiles.length === 0) {
    console.error('No frames extracted');
    process.exit(1);
  }

  console.log(`Asciifying ${pngFiles.length} frames at width=${width}...`);
  const metadata = { fps, frameDelayMs: Math.round(1000 / fps), frames: [] };

  for (let i = 0; i < pngFiles.length; i++) {
    const png = path.join(framesDir, pngFiles[i]);
    const txtName = pngFiles[i].replace(/\.png$/i, '.txt');
    const outTxt = path.join(asciiDir, txtName);

    // tune asciify options for speed/size
    const options = {
      fit: 'box',
      width,
      height: undefined,
      color: true,
      pixels: undefined,
    };

    try {
      const ascii = await asciifyImage(png, options);
      fs.writeFileSync(outTxt, ascii, 'utf8');
      metadata.frames.push({ file: `frames_txt/${txtName}` });
      if ((i + 1) % 20 === 0) process.stdout.write('.');
    } catch (err) {
      console.error(`Failed on ${png}:`, err);
    }
  }
  // write metadata
  fs.writeFileSync(path.join(outDir, 'frames.json'), JSON.stringify(metadata, null, 2), 'utf8');
  console.log(`\nWrote ${metadata.frames.length} ascii frames to ${asciiDir}`);
  console.log('metadata:', path.join(outDir, 'frames.json'));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});