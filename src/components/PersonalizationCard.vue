<!-- src/components/PersonalizationCard.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LangSelector from '@/components/LangSelector.vue'
import CustomSelect from '@/components/CustomSelect.vue'
import { getTheme, setTheme, type Theme } from '@/utils/theme'
import { setUiLanguage, type SupportedLocale } from '@/i18n'

defineProps<{
  languages: { code: string; label: string }[];
}>()

const { t } = useI18n()

const currentTheme = ref<Theme>(getTheme())

const themeOptions = computed(() => [
  { value: 'light', label: t('settings.themeLight') },
  { value: 'dark', label: t('settings.themeDark') },
  { value: 'system', label: t('settings.themeSystem') }
])

const handleThemeChange = (theme: string) => {
  const newTheme = theme as Theme
  currentTheme.value = newTheme
  setTheme(newTheme)
}

const handleLanguageChange = (langCode: string) => {
  setUiLanguage(langCode as SupportedLocale)
}
</script>

<template>
  <div class="config-card general-settings-card">
    <h3 class="section-title">{{ $t('settings.general') }}</h3>
    <div class="settings-grid">
      <div class="setting-item">
        <label class="setting-label">{{ $t('settings.language') }}</label>
        <LangSelector
          :modelValue="$i18n.locale"
          :options="languages"
          @update:modelValue="handleLanguageChange"
        />
      </div>
      <div class="setting-item">
        <label class="setting-label">{{ $t('settings.theme') }}</label>
        <CustomSelect
          :modelValue="currentTheme"
          :options="themeOptions"
          @update:modelValue="handleThemeChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.config-card {
  background-color: var(--bg-surface);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  @media (max-width: vars.$bp-mobile) {
    padding: 1.25rem 1rem;
  }
}

.section-title {
  margin: 0;
  color: var(--text-main);
  font-size: 1.15rem;
  font-weight: 600;
}

.general-settings-card {
  display: flex;
  flex-direction: column;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1.25rem;
}

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
