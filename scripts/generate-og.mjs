import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const W = 1200;
const H = 630;

const fern = `
  <g transform="translate(64 58)" fill="none">
    <path d="M20 37V7.5" stroke="#76b900" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M20 31.5c-5.4.1-9.7-2.4-12-6.4 5.2-.1 9.5 2.2 12 6.4Z" fill="#76b900" opacity=".92"/>
    <path d="M20 31.5c5.4.1 9.7-2.4 12-6.4-5.2-.1-9.5 2.2-12 6.4Z" fill="#76b900" opacity=".55"/>
    <path d="M20 25.2c-4.5.1-8-1.9-10-5.2 4.3-.1 7.8 1.8 10 5.2Z" fill="#76b900" opacity=".82"/>
    <path d="M20 25.2c4.5.1 8-1.9 10-5.2-4.3-.1-7.8 1.8-10 5.2Z" fill="#76b900" opacity=".42"/>
    <path d="M20 19.1c-3.5.1-6.2-1.4-7.8-4 3.3-.1 6 1.4 7.8 4Z" fill="#76b900" opacity=".7"/>
    <path d="M20 19.1c3.5.1 6.2-1.4 7.8-4-3.3-.1-6 1.4-7.8 4Z" fill="#76b900" opacity=".32"/>
    <path d="M20 13.2c-2.3.1-4.1-.9-5.1-2.7 2.2-.1 4 .9 5.1 2.7Z" fill="#76b900" opacity=".55"/>
    <path d="M20 13.2c2.3.1 4.1-.9 5.1-2.7-2.2-.1-4 .9-5.1 2.7Z" fill="#76b900" opacity=".22"/>
    <path d="M20 7.5c-1.2-1.4-1.4-3.2-.3-4.8 1.7.7 2.5 2.4 2 4.2" stroke="#76b900" stroke-width="1.5" stroke-linecap="round"/>
  </g>`;

const grid = Array.from({ length: 22 }, (_, i) => {
  const x = 40 + i * 56;
  return `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#ffffff" stroke-opacity="0.035"/>`;
}).join('') + Array.from({ length: 11 }, (_, i) => {
  const y = 40 + i * 56;
  return `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#ffffff" stroke-opacity="0.035"/>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="82%" cy="8%" r="70%">
      <stop offset="0" stop-color="#76b900" stop-opacity="0.26"/>
      <stop offset="0.55" stop-color="#76b900" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#76b900" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c0c0c" stop-opacity="0"/>
      <stop offset="1" stop-color="#0c0c0c" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0c0c0c"/>
  ${grid}
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#2a2a2a"/>

  ${fern}
  <text x="118" y="82" fill="#f2f2f2" font-family="DejaVu Sans, sans-serif" font-size="22" font-weight="700" letter-spacing="5">FERNOK</text>
  <text x="118" y="103" fill="#757575" font-family="Noto Sans CJK SC, sans-serif" font-size="12" letter-spacing="3">编程小蕨</text>
  <text x="${W - 64}" y="84" fill="#76b900" font-family="DejaVu Sans Mono, monospace" font-size="13" text-anchor="end" letter-spacing="1">fernok.github.io</text>

  <text x="64" y="212" fill="#76b900" font-family="DejaVu Sans Mono, monospace" font-size="14" letter-spacing="4">INDEPENDENT DEVELOPER / 2026</text>

  <text x="60" y="318" fill="#f2f2f2" font-family="Noto Sans CJK SC, sans-serif" font-size="78" font-weight="700" letter-spacing="-3">把想法编译成</text>
  <text x="60" y="408" fill="#f2f2f2" font-family="Noto Sans CJK SC, sans-serif" font-size="78" font-weight="700" letter-spacing="-3">可运行的产品<tspan fill="#76b900">.</tspan></text>

  <text x="64" y="468" fill="#a7a7a7" font-family="DejaVu Sans, sans-serif" font-size="19" letter-spacing="0.5">Astro 7   /   TypeScript   /   Bun   /   GitHub Pages</text>

  <rect x="64" y="510" width="${W - 128}" height="56" fill="#111111" stroke="#333333"/>
  <circle cx="86" cy="538" r="4" fill="#76b900"/>
  <text x="104" y="544" fill="#76b900" font-family="DejaVu Sans Mono, monospace" font-size="14">$</text>
  <text x="124" y="544" fill="#c6c6c6" font-family="DejaVu Sans Mono, monospace" font-size="14">bun run build</text>
  <text x="${W - 86}" y="544" fill="#8fd600" font-family="DejaVu Sans Mono, monospace" font-size="14" text-anchor="end">✓ built in 1.42s</text>

  <text x="64" y="602" fill="#555555" font-family="DejaVu Sans Mono, monospace" font-size="11" letter-spacing="2">BUILD / WRITE / SHIP</text>
  <text x="${W - 64}" y="602" fill="#555555" font-family="DejaVu Sans Mono, monospace" font-size="11" text-anchor="end" letter-spacing="2">OPEN SOURCE</text>
</svg>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0c0c0c"/>
  <rect x="1" y="1" width="62" height="62" rx="13" fill="none" stroke="#2a2a2a"/>
  <g transform="translate(12 12)" fill="none">
    <path d="M20 37V7.5" stroke="#76b900" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M20 31.5c-5.4.1-9.7-2.4-12-6.4 5.2-.1 9.5 2.2 12 6.4Z" fill="#76b900" opacity=".92"/>
    <path d="M20 31.5c5.4.1 9.7-2.4 12-6.4-5.2-.1-9.5 2.2-12 6.4Z" fill="#76b900" opacity=".55"/>
    <path d="M20 25.2c-4.5.1-8-1.9-10-5.2 4.3-.1 7.8 1.8 10 5.2Z" fill="#76b900" opacity=".82"/>
    <path d="M20 25.2c4.5.1 8-1.9 10-5.2-4.3-.1-7.8 1.8-10 5.2Z" fill="#76b900" opacity=".42"/>
    <path d="M20 19.1c-3.5.1-6.2-1.4-7.8-4 3.3-.1 6 1.4 7.8 4Z" fill="#76b900" opacity=".7"/>
    <path d="M20 19.1c3.5.1 6.2-1.4 7.8-4-3.3-.1-6 1.4-7.8 4Z" fill="#76b900" opacity=".32"/>
    <path d="M20 13.2c-2.3.1-4.1-.9-5.1-2.7 2.2-.1 4 .9 5.1 2.7Z" fill="#76b900" opacity=".55"/>
    <path d="M20 13.2c2.3.1 4.1-.9 5.1-2.7-2.2-.1-4 .9-5.1 2.7Z" fill="#76b900" opacity=".22"/>
    <path d="M20 7.5c-1.2-1.4-1.4-3.2-.3-4.8 1.7.7 2.5 2.4 2 4.2" stroke="#76b900" stroke-width="1.5" stroke-linecap="round"/>
  </g>
</svg>`;

await mkdir('public', { recursive: true });
await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile('public/og.png');
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile('public/apple-touch-icon.png');

console.log('Generated public/og.png and public/apple-touch-icon.png');
