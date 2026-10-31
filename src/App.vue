<script setup lang="ts">
import { ref } from 'vue';

import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';

import AppMainView from '@/components/AppMainView.vue';
import AppConfigurationView from '@/components/AppConfigurationView.vue';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
];

const showConfig = ref(false);

const toggleConfig = () => {
  showConfig.value = !showConfig.value;
};

const goHome = () => {
  showConfig.value = false;
};
</script>

<template>
  <AppHeader :showConfig="showConfig" @toggleConfig="toggleConfig" @home="goHome" />

  <div class="app-layout">
    <!-- Simulación de router con v-if -->
    <AppConfigurationView v-if="showConfig" :languages="languages" @close="toggleConfig" />
    <AppMainView v-else />

    <AppFooter />
  </div>
</template>
