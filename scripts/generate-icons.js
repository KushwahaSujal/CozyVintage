import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height) {
  // A minimal valid PNG generator in pure Node with zlib
  // Palette: Sage Green background #78927A, Vintage Ivory center, Antique Gold circle
  const rowSize = width * 4 + 1; // 1 filter byte per scanline
  const buffer = Buffer.alloc(height * rowSize);
  
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;
  const innerRadius = width * 0.28;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    buffer[rowOffset] = 0; // Filter type: None
    
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist <= innerRadius) {
        // Inner warm ivory glow (#F6F0E5)
        buffer[pxOffset] = 246;     // R
        buffer[pxOffset + 1] = 240; // G
        buffer[pxOffset + 2] = 229; // B
        buffer[pxOffset + 3] = 255; // A
      } else if (dist <= radius) {
        // Antique Gold & Sage gradient ring (#B68B58 to #78927A)
        const t = (dist - innerRadius) / (radius - innerRadius);
        buffer[pxOffset] = Math.round(182 * (1 - t) + 120 * t);
        buffer[pxOffset + 1] = Math.round(139 * (1 - t) + 146 * t);
        buffer[pxOffset + 2] = Math.round(88 * (1 - t) + 122 * t);
        buffer[pxOffset + 3] = 255;
      } else {
        // Outer Warm Ivory / Sage border (#78927A)
        buffer[pxOffset] = 120;     // R
        buffer[pxOffset + 1] = 146; // G
        buffer[pxOffset + 2] = 122; // B
        buffer[pxOffset + 3] = 255;
      }
    }
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression: Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace: None
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT chunk (compressed raw data)
  const compressed = zlib.deflateSync(buffer);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);
  
  const crc = crc32(Buffer.concat([Buffer.from(type), data]));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Simple CRC32 for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const dir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'icon-192.png'), createPng(192, 192));
fs.writeFileSync(path.join(dir, 'icon-512.png'), createPng(512, 512));
fs.writeFileSync(path.join(dir, 'icon-512-maskable.png'), createPng(512, 512));
console.log('Successfully generated icon-192.png, icon-512.png, icon-512-maskable.png');
