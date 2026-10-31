<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import SettingsIcon from './SettingsIcon.vue';

defineProps<{
  showSettings: boolean;
  /** Shows the share button; the app handles the `share` event. */
  showShare?: boolean;
}>();

const emit = defineEmits<{
  (e: 'home'): void;
  (e: 'toggle-settings'): void;
  (e: 'share'): void;
}>();

const { t } = useI18n();
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <button
        type="button"
        class="navbar-brand"
        :aria-label="t('header.title')"
        @click="emit('home')"
      >
        <div>
          <h1 class="title">{{ t('header.title') }}</h1>
          <p class="subtitle">{{ t('header.subtitle') }}</p>
        </div>
      </button>

      <div class="navbar-actions">
        <button
          v-if="showShare"
          type="button"
          class="btn-secondary config-toggle"
          :aria-label="t('header.share')"
          :title="t('header.share')"
          @click="emit('share')"
        >
          <svg
            class="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>
        <button
          type="button"
          class="btn-secondary config-toggle"
          :class="{ 'config-toggle--active': showSettings }"
          :aria-label="t('header.settings')"
          :title="t('header.settings')"
          :aria-expanded="showSettings"
          @click="emit('toggle-settings')"
        >
          <SettingsIcon class="icon" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 2000;
  padding: 0.75rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.navbar-container {
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  border-radius: 6px;
  text-decoration: none;
}

.navbar-brand:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 4px;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-main);
  margin: 0;
  text-align: left;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0.15rem 0 0 0;
  font-weight: 400;
  text-align: left;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.config-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.config-toggle:hover {
  background-color: var(--bg-surface-hover, rgba(0, 0, 0, 0.05));
}

.config-toggle:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

.config-toggle--active {
  background-color: var(--accent-color);
  color: var(--bg-body);
  border-color: var(--accent-color);
}

.config-toggle--active:hover {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  opacity: 0.9;
}

.icon {
  width: 18px;
  height: 18px;
}

@media (max-width: 600px) {
  .navbar-container {
    padding: 0 1rem;
  }
  .title {
    font-size: 1.05rem;
  }
  .subtitle {
    display: none;
  }
}
</style>
