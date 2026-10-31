<script setup lang="ts">
import SettingsIcon from '@/components/SettingsIcon.vue';

defineProps<{
  showConfig: boolean;
}>();

const emit = defineEmits<{
  (emitEvent: 'toggleConfig'): void;
  (emitEvent: 'home'): void;
}>();
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <button
        type="button"
        class="navbar-brand"
        :aria-label="$t('hero.title')"
        @click="emit('home')"
      >
        <div>
          <h1 class="title">{{ $t('hero.title') }}</h1>
          <p class="subtitle">{{ $t('hero.subtitle') }}</p>
        </div>
      </button>

      <div class="navbar-actions">
        <button
          type="button"
          class="btn-secondary config-toggle"
          :class="{ 'config-toggle--active': showConfig }"
          :aria-pressed="showConfig"
          :aria-label="$t('configurator.title') || 'Settings'"
          @click="emit('toggleConfig')"
        >
          <SettingsIcon class="icon" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.navbar {
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
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

  &:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 4px;
  }
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
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;

  &--active {
    background-color: var(--accent-color);
    color: var(--bg-body);
    border-color: var(--accent-color);

    &:hover {
      background-color: var(--accent-color);
      border-color: var(--accent-color);
      opacity: 0.9;
    }
  }
}

@media (max-width: vars.$bp-mobile) {
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
