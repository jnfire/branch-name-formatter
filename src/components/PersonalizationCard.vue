<!-- src/components/PersonalizationCard.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import LangSelector from './LangSelector.vue';
import CustomSelect from './CustomSelect.vue';
import { getTheme, setTheme, type Theme } from '../utils/theme';
import { setUiLanguage, type SupportedLocale } from '../i18n';

const { t, locale } = useI18n();

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
];

const currentTheme = ref<Theme>(getTheme());

const themeOptions = computed(() => [
  { value: 'light', label: t('settings.themeLight') || 'Light' },
  { value: 'dark', label: t('settings.themeDark') || 'Dark' },
  { value: 'system', label: t('settings.themeSystem') || 'System' },
]);

const handleThemeChange = (theme: string) => {
  const newTheme = theme as Theme;
  currentTheme.value = newTheme;
  setTheme(newTheme);
};

const handleLanguageChange = (langCode: string) => {
  setUiLanguage(langCode as SupportedLocale);
};
</script>

<template>
  <section class="settings-card" :aria-label="t('settings.personalization') || 'Personalization'">
    <h3 class="section-title">{{ t('settings.personalization') || 'Personalization' }}</h3>
    <div class="settings-grid">
      <div class="setting-item">
        <label class="setting-label">{{ t('settings.language') || 'Language' }}</label>
        <LangSelector
          :modelValue="locale"
          :options="languages"
          @update:modelValue="handleLanguageChange"
        />
      </div>
      <div class="setting-item">
        <label class="setting-label">{{ t('settings.theme') || 'Theme' }}</label>
        <CustomSelect
          :modelValue="currentTheme"
          :options="themeOptions"
          @update:modelValue="handleThemeChange"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.setting-label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-main);
}
</style>
