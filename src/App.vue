<script setup lang="ts">
import { ref } from 'vue'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'

import AppMainView from '@/components/AppMainView.vue'
import AppConfigurationView from '@/components/AppConfigurationView.vue'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' }
]

const showConfig = ref(false)

const toggleConfig = () => {
  showConfig.value = !showConfig.value
}

const goHome = () => {
  showConfig.value = false
}
</script>

<template>
  <AppHeader :showConfig="showConfig" @toggleConfig="toggleConfig" @home="goHome" />

  <div class="app-layout">
    <header v-if="!showConfig" class="app-hero container">
      <p class="subtitle">{{ $t('hero.subtitle') }}</p>
      <div class="badges">
        <span class="badge">{{ $t('hero.badges.auditable') }}</span>
        <span class="badge">{{ $t('hero.badges.privacy') }}</span>
        <span class="badge">{{ $t('hero.badges.serverless') }}</span>
      </div>
    </header>

    <!-- Simulación de router con v-if -->
    <AppConfigurationView v-if="showConfig" :languages="languages" @close="toggleConfig" />
    <AppMainView v-else />

    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.app-hero {
  text-align: center;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: vars.$bp-mobile) {
  .app-hero {
    margin-top: 1.5rem;
  }
  .subtitle {
    font-size: 1rem;
  }
}

.badges {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  background-color: var(--bg-surface);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>