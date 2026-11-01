<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/AppIcon.vue';
import CustomSelect from '@/components/CustomSelect.vue';
import FormatPreview from '@/components/FormatPreview.vue';
import type { BranchFormatTemplate, LanguageProfile } from '@/core/FormatTypes';
import { segmentColor } from '@/utils/segmentColor';

defineProps<{ format: BranchFormatTemplate }>();
const emit = defineEmits<{ (e: 'update-language', language: LanguageProfile): void }>();

const { t } = useI18n();
const resolveLabel = (value: string) => (value.includes('.') ? t(value) : value);
const token = (id: string) => `{${id}}`;
const samples = ref<Record<string, string>>({});

const languageOptions: { value: LanguageProfile; label: string }[] = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
];

const typeLabel = (type?: string) =>
  type === 'select' ? t('configurator.editor.typeSelect') : t('configurator.editor.typeText');
const capLabel = (cap: string) =>
  cap === 'UPPERCASE'
    ? t('configurator.editor.capUpper')
    : cap === 'LOWERCASE'
      ? t('configurator.editor.capLower')
      : t('configurator.editor.capAsIs');
</script>

<template>
  <div>
    <div class="note">
      <AppIcon name="info" />
      <span>{{ $t('formats.builtinNote') }}</span>
    </div>

    <FormatPreview v-model:samples="samples" :format="format" />

    <div class="ed-field">
      <span id="readonly-language-label" class="ed-label">{{
        $t('configurator.editor.language')
      }}</span>
      <CustomSelect
        :model-value="format.language"
        :options="languageOptions"
        @update:model-value="emit('update-language', $event as LanguageProfile)"
      />
      <p class="ed-help">{{ $t('configurator.editor.languageHelp_' + format.language) }}</p>
    </div>

    <div class="ed-section">
      <div class="ed-section-head">
        <h4 class="ed-label">{{ $t('configurator.editor.fields') }}</h4>
      </div>
      <div class="ro-fields">
        <div v-for="(field, index) in format.fields" :key="field.id" class="ro-field">
          <span class="dot" :style="{ '--c': segmentColor(index) }"></span>
          <span class="name">{{ resolveLabel(field.label) }}</span>
          <span class="tok-chip" :style="{ '--c': segmentColor(index) }">{{
            token(field.id)
          }}</span>
          <span class="meta">{{
            $t('formats.fieldMeta', {
              type: typeLabel(field.type),
              cap: capLabel(field.capitalization),
            })
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
