import * as s from "simple-icons";

const want = [
  "github", "youtube", "x", "instagram", "facebook", "tiktok", "reddit",
  "discord", "twitch", "telegram", "whatsapp", "pinterest", "threads",
  "medium", "linkedin", "gmail", "linktree", "rss", "music", "microphone",
  "spotify", "patreon", "snapchat", "mastodon", "bluesky", "steam", "email",
  "website", "portfolio", "shop", "link",
];

const out = {};
for (const w of want) {
  const ic = s["si" + w] || s["si" + w.charAt(0).toUpperCase() + w.slice(1)];
  if (ic) {
    out[w] = { title: ic.title, path: ic.path, color: ic.color };
  }
}

// 找不到時用 generic fallback（自行定義）
out.website = out.website || out.link;
console.log(JSON.stringify(out, null, 2));
