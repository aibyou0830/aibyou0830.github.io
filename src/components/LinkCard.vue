<script setup>
import { computed } from "vue";
import { resolveIcon } from "../icons.js";

const props = defineProps({
  link: { type: Object, required: true },
});

const icon = computed(() => resolveIcon(props.link));
const style = computed(() => {
  const s = {};
  if (props.link.color) s["--accent"] = props.link.color;
  return s;
});
</script>

<template>
  <a
    class="link-card"
    :href="link.url"
    :style="style"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span class="link-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path :d="icon.path" />
      </svg>
    </span>

    <span class="link-body">
      <span class="link-title">{{ link.title }}</span>
      <span v-if="link.description" class="link-desc">{{ link.description }}</span>
    </span>

    <span class="link-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M7 17V7l10 10H7z" />
      </svg>
    </span>
  </a>
</template>
