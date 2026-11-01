<!-- src/components/FlagIcon.vue -->
<script setup lang="ts">
defineProps<{
  code: string;
}>();
</script>

<template>
  <!-- Decorative: the language name/code label next to it already conveys the
       meaning, so these are hidden from assistive tech to avoid duplicate noise. -->
  <svg
    class="flag-icon"
    viewBox="0 0 30 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="code === 'es'">
      <rect width="30" height="20" fill="#AA151B" />
      <rect y="5" width="30" height="10" fill="#F1BF00" />
    </template>

    <template v-else-if="code === 'fr'">
      <rect width="30" height="20" fill="#ED2939" />
      <rect width="20" height="20" fill="#FFFFFF" />
      <rect width="10" height="20" fill="#002395" />
    </template>

    <template v-else-if="code === 'de'">
      <rect width="30" height="20" fill="#FFCE00" />
      <rect width="30" height="13.34" fill="#D00" />
      <rect width="30" height="6.67" fill="#000" />
    </template>

    <template v-else-if="code === 'it'">
      <rect width="30" height="20" fill="#CE2B37" />
      <rect width="20" height="20" fill="#FFFFFF" />
      <rect width="10" height="20" fill="#009246" />
    </template>

    <template v-else-if="code === 'pt'">
      <rect width="30" height="20" fill="#FF0000" />
      <rect width="12" height="20" fill="#006600" />
      <circle cx="12" cy="10" r="3.5" fill="#FFCC00" stroke="#000" stroke-width="0.3" />
    </template>

    <template v-else>
      <!-- 'en': simplified Union Jack -->
      <rect width="30" height="20" fill="#00247D" />
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFFFFF" stroke-width="4" />
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#CF142B" stroke-width="1.6" />
      <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" stroke-width="6.6" />
      <path d="M15,0 V20 M0,10 H30" stroke="#CF142B" stroke-width="4" />
    </template>
  </svg>
</template>

<style scoped>
.flag-icon {
  width: 1.15em;
  height: 0.77em;
  border-radius: 2px;
  flex-shrink: 0;
  display: inline-block;
}
</style>
