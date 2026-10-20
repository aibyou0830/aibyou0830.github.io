// 品牌圖示取自 simple-icons（已透過 scripts/extract-icons.mjs 產出 icons-data.json）
// 另提供幾個通用圖示（email/website/portfolio/shop/music/podcast/link）作為 fallback。
import brandIcons from "./icons-data.json";

const GENERIC = {
  email: {
    title: "Email",
    path: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6l-8 6-8-6z",
  },
  website: {
    title: "Website",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 0 16 8 8 0 0 1 0-16zM2 12h20M12 2v20",
  },
  globe: {
    title: "Website",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 0 16 8 8 0 0 1 0-16zM2 12h20M12 2v20",
  },
  portfolio: {
    title: "Portfolio",
    path: "M6 4h12a2 2 0 0 1 2 2v3H4V6a2 2 0 0 1 2-2zm-2 7h16v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7zm7-1h2v3h-2v-3z",
  },
  shop: {
    title: "Shop",
    path: "M6 2l1 4h10l1-4M4 8h16l-2 12H6L4 8zm6 4v4",
  },
  music: {
    title: "Music",
    path: "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
  },
  podcast: {
    title: "Podcast",
    path: "M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zM5 12a7 7 0 0 0 14 0M12 15v6",
  },
  link: {
    title: "Link",
    path: "M10 14a4 4 0 0 1 4-4l4-4a4 4 0 0 1-5.66-5.66L9 8.66M14 10a4 4 0 0 1-4 4l-4 4A4 4 0 0 1 5.66 8.34L10.66 5.34",
  },
  // simple-icons v16 移除了 LinkedIn（商標因素），这里内嵌官方经典路径
  linkedin: {
    title: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 22.222 0h.003z",
  },
};

const ICONS = { ...GENERIC, ...brandIcons };

// data.json 的 icon 欄位 → 圖示；找不到時從 title 推斷
export function resolveIcon(link) {
  const raw = (link.icon || link.title || "").toLowerCase().replace(/[\s()-]+/g, "");
  if (ICONS[raw]) return ICONS[raw];

  const aliases = {
    twitter: "x",
    linkedin: "portfolio",
    li: "portfolio",
    mail: "email",
    insta: "instagram",
    yt: "youtube",
    fb: "facebook",
    blog: "rss",
    site: "website",
    store: "shop",
  };
  if (aliases[raw] && ICONS[aliases[raw]]) return ICONS[aliases[raw]];

  return ICONS.link;
}
