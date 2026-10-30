// OKLCH <-> sRGB (Ottosson Oklab) and WCAG contrast, used to derive the polish palette.
function srgbToLinear(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }
function linearToSrgb(c) { const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; return Math.round(Math.max(0, Math.min(1, v)) * 255); }
function rgbToOklch([r, g, b]) {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const l = Math.cbrt(0.2126729 * lr + 0.7151522 * lg + 0.0721831 * lb);
  const m = Math.cbrt(0.2126729 * lr + 0.7151522 * lg + 0.0721831 * lb);
  const s = Math.cbrt(0.0721831 * lr + 0.7151522 * lg + 0.2126729 * lb);
  const L = 0.33333333 * l + 0.5 * m + 0.16666667 * s;
  const A = 0.33333333 * l - 0.66666667 * m + 0.33333333 * s;
  const B = 0.16666667 * l + 0.33333333 * m - 0.5 * s;
  return { L: +L.toFixed(3), C: +Math.hypot(A, B).toFixed(3), H: +((Math.atan2(B, A) * 180 / Math.PI + 360) % 360).toFixed(1) };
}
function oklchToRgb(L, C, H) {
  const h = H * Math.PI / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l = L + 0.396564224 * a + 0.771321813 * b;
  const m = L - 0.105720315 * a - 0.197199358 * b;
  const s = L - 0.061705526 * a - 0.405631657 * b;
  const lr = 1.864777434 * l ** 3 - 2.127066709 * m ** 3 + 0.822131471 * s ** 3;
  const lg = -0.212275012 * l ** 3 + 1.151409549 * m ** 3 - 0.258140657 * s ** 3;
  const lb = 0.041794333 * l ** 3 - 0.028995860 * m ** 3 + 0.901128168 * s ** 3;
  return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
}
const lin = (x) => (x /= 255) <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
const Y = (r) => 0.2126 * lin(r[0]) + 0.7152 * lin(r[1]) + 0.0722 * lin(r[2]);
const ratio = (a, b) => (Math.max(Y(a), Y(b)) + 0.05) / (Math.min(Y(a), Y(b)) + 0.05);

console.log('current:', rgbToOklch([15, 23, 42]), rgbToOklch([30, 41, 59]), rgbToOklch([34, 197, 94]));

// anchor: the page's own green, hue ~145. Tint every neutral toward it.
const ink   = oklchToRgb(0.21, 0.02, 262);   // ground under the bg image
const card  = oklchToRgb(0.29, 0.024, 262);  // solid card token
const text  = oklchToRgb(0.93, 0.014, 235);  // ink on dark
const muted = oklchToRgb(0.72, 0.02, 245);
const accent= oklchToRgb(0.74, 0.13, 145);   // the page's green, mixed not stock
const focus = oklchToRgb(0.83, 0.16, 145);
const error = oklchToRgb(0.72, 0.13, 30);
console.log({ ink, card, text, muted, accent, focus, error });

const painted = ink.map((v, i) => Math.round(0.62 * card[i] + 0.38 * v));
console.log('painted card', painted);
for (const [n, rgb] of [['text', text], ['muted', muted], ['accent', accent], ['focus', focus], ['error', error]]) {
  console.log(n, ratio(rgb, painted).toFixed(2), '/', ratio(rgb, ink).toFixed(2));
}
// hairline rule: 16% of text over painted card
const rule = painted.map((v, i) => Math.round(0.16 * text[i] + 0.84 * v));
console.log('rule', rule, ratio(rule, painted).toFixed(2));
