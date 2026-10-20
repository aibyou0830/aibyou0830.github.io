# LinkTree 靜態一頁式網頁（Bun + Vue + Vite）

用 Bun 做套件管理，Vue 3 當作架構基底，从 JSON 檔案讀取社交網路連結。

## 檔案結構

```
├── index.html                 # SPA 入口
├── vite.config.ts             # Vite 設定（含 @vitejs/plugin-vue）
├── package.json               # Bun 套件與 scripts
├── public/
│   └── data.json              # 執行期讀取的連結設定（可改後直接生效）
├── src/
│   ├── main.js                # createApp 啟動，import styles.css
│   ├── App.vue                # 一頁式主組件：profile + 連結列表
│   ├── components/
│   │   └── LinkCard.vue       # 單一連結卡片（SVG 圖示 + 標題 + 說明）
│   ├── styles.css             # 主题色 / 卡片 / hover 動畫
│   ├── icons.js               # 圖示對應表 + resolveIcon() 推斷邏輯
│   ├── icons-data.json        # 品牌 SVG path（取自 simple-icons）
│   └── data.json              # 内嵌 fallback 設定
└── scripts/
    └── extract-icons.mjs      # 產生 icons-data.json
```

## 指令

```bash
bun install              # 安裝套件（vue, vite, @vitejs/plugin-vue, simple-icons）
bun run dev              # 開發模式：http://localhost:5173，熱更新
bun run build            # 產靜態檔案到 dist/
bun run preview          # 預覽 build 結果：http://localhost:4173
bun scripts/extract-icons.mjs > src/icons-data.json   # 更新圖示庫
```

## 設定 `public/data.json`

```json
{
  "name": "aibyou0830",
  "handle": "@aibyou0830",
  "avatar": "https://github.com/aibyou0830.png",
  "bio": "Full-stack 開發者 | AI 愛好者",
  "theme": { "bg": "#0f172a", "card": "#1e293b", "text": "#e2e8f0", "muted": "#94a3b8", "accent": "#22c55e" },
  "links": [
    { "title": "GitHub", "url": "https://github.com/aibyou0830", "icon": "github", "description": "我的開源專案" },
    { "title": "X (Twitter)", "url": "https://x.com/aibyou0830", "icon": "x", "color": "#1da1f2" }
  ]
}
```

- `icon` 可用：github / youtube / x / instagram / facebook / tiktok / reddit / discord / twitch / telegram / whatsapp / pinterest / threads / medium / linkedin / gmail / linktree / rss / spotify / patreon / snapchat / mastodon / bluesky / steam / email / website / portfolio / shop / music / podcast / link。
- 没寫 `icon` 時會從 `title` 推斷（例如「My Blog」→ rss）。找不到则通用 link 圖示。
- `color` 可為特定卡片覆寫 accent 色。

## 部署到 GitHub Pages

`aibyou0830.github.io` 这类仓库会直接 Serve 根目录，所以有兩種方式：

1. **直接 commit `dist/`**：在 `.gitignore` 移除 `dist`，`bun run build` 後 commit，並將 Pages 來源指向该目錄。
2. **GitHub Actions**：仓库已含 `.github/workflows/pages.yml`（需自行建立或沿用本專案的 workflow），每次 push 自動 build 並部署 `dist/`。
