// Ad-hoc mobile inspection for the audit (read-only; does not touch project files).
import puppeteer from 'puppeteer';

const chrome = '/home/edward/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });

const VIEWPORTS = [
  { w: 320, h: 568, label: '320x568 (小手機)' },
  { w: 375, h: 812, label: '375x812 (iPhone X/12)' },
  { w: 414, h: 896, label: '414x896 (大手機)' },
  { w: 375, h: 667, label: '375x667 (旧 iPhone SE)' },
];

const rows = [];
for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.w, height: vp.h });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  const data = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.link-card')].map((el) => {
      const r = el.getBoundingClientRect();
      return { title: el.querySelector('.link-title')?.textContent, w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), bottom: Math.round(r.bottom) };
    });
    const avatar = document.querySelector('.avatar')?.getBoundingClientRect();
    const name = document.querySelector('.name')?.getBoundingClientRect();
    const bio = document.querySelector('.bio')?.getBoundingClientRect();
    const bg = getComputedStyle(document.body);
    return {
      docW: document.documentElement.scrollWidth,
      bodyW: document.body.scrollWidth,
      innerW: window.innerWidth,
      totalHeight: Math.round(document.documentElement.scrollHeight),
      avatarTop: avatar ? Math.round(avatar.top) : null,
      bioBottom: bio ? Math.round(bio.bottom) : null,
      cards,
      bgSize: bg.backgroundSize,
      bgAttach: bg.backgroundAttachment,
      bodyPad: bg.padding,
    };
  });
  rows.push({ label: vp.label, ...data });
  await page.close();
}

// Contrast of muted text on the card surface (computed, not guessed)
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 812 });
await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
const pairs = await page.evaluate(() => {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const Y = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => (Math.max(Y(a), Y(b)) + 0.05) / (Math.min(Y(a), Y(b)) + 0.05);
  const hex = (s) => { const m = s.match(/\d+(\.\d+)?/g); return m.slice(0, 3).map((n) => parseFloat(n)); };
  const cs = getComputedStyle(document.body);
  const card = document.querySelector('.link-card');
  const cardBg = cs.backgroundColor; // body bg under translucent card
  const parse = (rgb) => rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
  const bg = parse(cs.backgroundColor);
  // approximate blended card colour: 62% card over bg
  const cardSolid = parse(getComputedStyle(document.documentElement).getPropertyValue('--card') || 'rgb(30,41,59)');
  const blended = bg.map((b, i) => 0.62 * cardSolid[i] + 0.38 * b);
  const text = parse(cs.color);
  const mutedEl = document.querySelector('.link-desc');
  const muted = parse(getComputedStyle(mutedEl).color);
  const accent = parse(getComputedStyle(document.querySelector('.link-icon')).color);
  const iconEl = document.querySelector('.link-icon svg');
  return {
    textOnCard: ratio(text, blended),
    mutedOnCard: ratio(muted, blended),
    accentOnCard: ratio(accent, blended),
    svgSize: iconEl ? [iconEl.getAttribute('width'), iconEl.getAttribute('height')] : null,
    focusOutline: getComputedStyle(document.querySelector('.link-card')).outline,
    reducedMotion: !!([...document.querySelectorAll('style')].some((s) => /prefers-reduced-motion/.test(s.textContent))),
  };
});

console.log(JSON.stringify({ rows, pairs }, null, 2));
await browser.close();
