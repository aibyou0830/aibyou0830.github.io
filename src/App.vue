<script setup>
import { ref, computed, watch } from "vue";
import LinkCard from "./components/LinkCard.vue";
import fallbackData from "../public/data.json";

const profile = ref({ name: "My Links", links: [] });
const loading = ref(true);
const error = ref("");

// data.json 的 theme 欄位是整頁的 token 來源；未提供的欄位沿用 styles.css 的 :root 值。
const theme = computed(() => {
  const t = profile.value.theme || {};
  const vars = {};
  if (t.bg) vars["--bg"] = t.bg;
  if (t.bgImage) vars["--bg-image"] = `url("${String(t.bgImage).replace(/"/g, "")}")`;
  if (t.bgImage) vars["--bg-overlay"] = t.bgOverlay || "var(--bg)";
  if (t.card) vars["--card"] = t.card;
  if (t.text) vars["--text"] = t.text;
  if (t.muted) vars["--muted"] = t.muted;
  if (t.accent) vars["--accent"] = t.accent;
  return vars;
});

watch(
  theme,
  (vars) => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
  },
  { immediate: true },
);

// 優先讀取 public/data.json（可在不重新建置的情况下編輯）。
// 若無法 fetch（例如直接用 file:// 開啟），退回打包時內嵌的同一份資料。
async function load() {
  try {
    const res = await fetch("/data.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    profile.value = await res.json();
  } catch (e) {
    profile.value = fallbackData;
    error.value = "無法讀取 /data.json（" + e.message + "），已使用打包時內嵌的資料。";
  } finally {
    loading.value = false;
  }
}

load();
</script>

<template>
  <div class="page">
    <header class="profile">
      <img v-if="profile.avatar" class="avatar" :src="profile.avatar" :alt="profile.name" />
      <h1 class="name">{{ profile.name }}</h1>
      <p v-if="profile.handle" class="handle">{{ profile.handle }}</p>
      <p v-if="profile.bio" class="bio">{{ profile.bio }}</p>
    </header>

    <p v-if="loading" class="state">載入連結…</p>
    <p v-if="error" class="state error">{{ error }}</p>

    <main v-if="!loading && profile.links?.length" class="links">
      <LinkCard v-for="link in profile.links" :key="link.url" :link="link" />
    </main>

    <footer class="footer">
      © {{ new Date().getFullYear() }} {{ profile.name }}
    </footer>
  </div>
</template>
