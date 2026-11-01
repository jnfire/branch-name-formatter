<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/AppIcon.vue';
import BranchName from '@/components/BranchName.vue';
import { BranchFormatter } from '@/core/BranchFormatter';
import type { BranchFormatTemplate } from '@/core/FormatTypes';
import { segmentColor } from '@/utils/segmentColor';

const props = defineProps<{
  format: BranchFormatTemplate | null;
}>();

/** What the user typed to try the format with; empty fields show their ID. */
const samples = defineModel<Record<string, string>>('samples', { default: () => ({}) });

const { t } = useI18n();
const resolveLabel = (value: string) => (value.includes('.') ? t(value) : value);

const values = computed(() => {
  const result: Record<string, string> = {};
  for (const field of props.format?.fields ?? []) {
    const typed = samples.value[field.id]?.trim();
    result[field.id] = typed ? typed : field.id;
  }
  return result;
});

const segments = computed(() =>
  props.format ? BranchFormatter.formatSegments(props.format, values.value) : [],
);

const setSample = (fieldId: string, value: string) => {
  samples.value = { ...samples.value, [fieldId]: value };
};
</script>

<template>
  <div class="ed-preview">
    <span class="card-title">{{ $t('preview.title') }}</span>
    <BranchName v-if="format" :segments="segments" />
    <p v-else class="hint">{{ $t('preview.placeholder') }}</p>

    <details v-if="format && format.fields.length" class="try">
      <summary>
        <AppIcon name="chevron" />
        {{ $t('formats.tryExample') }}
      </summary>
      <div class="try-grid">
        <div v-for="(field, index) in format.fields" :key="index" class="ed-field">
          <label class="ed-label" :for="`try-${index}`">
            <span class="dot" :style="{ '--c': segmentColor(index) }"></span>
            {{ resolveLabel(field.label) }}
          </label>
          <input
            :id="`try-${index}`"
            class="input-element"
            type="text"
            :value="samples[field.id] ?? ''"
            spellcheck="false"
            autocomplete="off"
            @input="setSample(field.id, ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </details>
  </div>
</template>
