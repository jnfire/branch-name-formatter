<script setup lang="ts">
import { computed } from 'vue';

import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';

import AppMainView from '@/components/AppMainView.vue';
import FormatsView from '@/components/FormatsView.vue';
import SettingsView from '@/components/SettingsView.vue';
import { useRoute } from '@/composables/useRoute';

const { route, goHome, goSettings } = useRoute();

const onSettings = computed(() => route.value.name === 'settings');

// The gear opens the settings; pressing it again goes back to the generator.
const toggleSettings = () => (onSettings.value ? goHome() : goSettings());
</script>

<template>
  <AppHeader :showSettings="onSettings" @toggle-settings="toggleSettings" @home="goHome" />

  <div class="app-layout">
    <main class="main-content container-wide">
      <FormatsView v-if="route.name === 'formats'" />
      <SettingsView v-else-if="route.name === 'settings'" />
      <AppMainView v-else />
    </main>

    <AppFooter />
  </div>
</template>
