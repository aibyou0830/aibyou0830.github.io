<script setup>
import { ref, computed } from "vue";
import LinkCard from "./components/LinkCard.vue";
import fallbackData from "./data.json";

const profile = ref({ name: "My Links", links: [] });
const loading = ref(true);
const error = ref("");

const theme = computed(() => {
  const t = profile.value.theme || {};
  return {
    "--bg": t.bg || "#0f172a",
    "--card": t.card || "#1e293b",
    "--text": t.text || "#e2e8f0",
    "--muted": t.muted || "#94a3b8",
    "--accent": t.accent || "#22c55e",
  };
});

// 優先讀取 public/data.json（可在不重新建置的情况下編輯）。
// 若無法 fetch（例如直接用 file:// 開啟），退回打包時內嵌的 src/data.json。
async function load() {
  try {
    const res = await fetch("/data.json", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    profile.value = await res.json();
  } catch (e) {
    profile.value = fallbackData;
    error.value = "無法讀取 /data.json（" + e.message + "），已使用內嵌的 src/data.json。";
  } finally {
    loading.value = false;
  }
}

load();
</script>

<template>
  <div class="page" :style="theme">
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
