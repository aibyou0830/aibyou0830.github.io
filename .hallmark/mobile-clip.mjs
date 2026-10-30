// Mobile-specific probe: does the centred layout clip at short viewports?
import puppeteer from 'puppeteer';
const chrome = '/home/edward/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 600 });
await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
const r = await page.evaluate(() => {
  const app = document.querySelector('#app').getBoundingClientRect();
  const cards = [...document.querySelectorAll('.link-card')].map(e => {
    const b = e.getBoundingClientRect();
    return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) };
  });
  return { appTop: Math.round(app.top), appBottom: Math.round(app.bottom), vh: window.innerHeight, cards, scrollable: document.documentElement.scrollHeight > window.innerHeight };
});
console.log(JSON.stringify(r));
// simulate the scroll a phone would need
await page.evaluate(() => window.scrollTo(0, 9999));
const after = await page.evaluate(() => {
  const last = document.querySelector('.footer').getBoundingClientRect();
  return { footerTop: Math.round(last.top), footerBottom: Math.round(last.bottom), vh: window.innerHeight };
});
console.log('after scroll:', JSON.stringify(after));
await browser.close();
