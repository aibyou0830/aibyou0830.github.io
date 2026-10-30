import puppeteer from 'puppeteer';
const chrome = '/home/edward/.cache/puppeteer/chrome/linux-156.0.8078.47/chrome-linux64/chrome';
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 375, height: 420 });
await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
const r = await page.evaluate(() => {
  const app = document.querySelector('#app').getBoundingClientRect();
  const body = document.body.getBoundingClientRect();
  const name = document.querySelector('.name').getBoundingClientRect();
  const cards = [...document.querySelectorAll('.link-card')].map(e => {
    const b = e.getBoundingClientRect();
    return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: Math.round(b.height) };
  });
  return {
    vh: window.innerHeight,
    bodyTop: Math.round(body.top), bodyBottom: Math.round(body.bottom),
    appTop: Math.round(app.top), appBottom: Math.round(app.bottom),
    nameTop: Math.round(name.top),
    firstVisibleCardBottom: cards.find(c => c.bottom <= window.innerHeight)?.bottom ?? null,
    scrollHeight: document.documentElement.scrollHeight,
    canScrollUpAtTop: window.scrollY,
  };
});
console.log(JSON.stringify(r, null, 2));
// can the user scroll up to see anything above? scroll to top explicitly
await page.evaluate(() => window.scrollTo(0, -1000));
const top = await page.evaluate(() => ({ scrollY: window.scrollY, appTop: Math.round(document.querySelector('#app').getBoundingClientRect().top) }));
console.log('after scrollTo top:', JSON.stringify(top));
await page.screenshot({ path: '.hallmark/probe-375x420.png', fullPage: false });
await browser.close();
