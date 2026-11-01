<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/AppIcon.vue';
import { FormatManager } from '@/core/FormatManager';

const { t } = useI18n();

const fileInput = ref<HTMLInputElement | null>(null);
const status = ref<{ kind: 'ok' | 'error'; text: string } | null>(null);

const exportFormats = () => {
  const data = FormatManager.exportConfiguration();
  const link = document.createElement('a');
  link.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(data));
  link.setAttribute('download', 'branch-formats.json');
  link.click();
};

const importFormats = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (loaded) => {
    try {
      FormatManager.importCustomFormats(loaded.target?.result as string);
      status.value = { kind: 'ok', text: t('configurator.importSuccess') };
    } catch {
      status.value = { kind: 'error', text: t('configurator.importError') };
    }
  };
  reader.readAsText(file);
  input.value = ''; // lets the same file be chosen again
};
</script>

<template>
  <section class="settings-card" :aria-label="$t('settings.backup.title')">
    <h3 class="section-title backup-title">{{ $t('settings.backup.title') }}</h3>
    <p class="st-help">{{ $t('settings.backup.help') }}</p>

    <div class="backup-btns">
      <button type="button" class="btn-secondary with-ico" @click="exportFormats">
        <AppIcon name="download" />
        {{ $t('configurator.exportCustom') }}
      </button>
      <button type="button" class="btn-secondary with-ico" @click="fileInput?.click()">
        <AppIcon name="upload" />
        {{ $t('configurator.importJson') }}
      </button>
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        class="sr-only"
        tabindex="-1"
        :aria-label="$t('configurator.importJson')"
        @change="importFormats"
      />
    </div>

    <p v-if="status" class="status" :class="{ 'is-error': status.kind === 'error' }" role="status">
      <AppIcon :name="status.kind === 'ok' ? 'check' : 'alert'" :stroke-width="2.4" />
      {{ status.text }}
    </p>
  </section>
</template>
