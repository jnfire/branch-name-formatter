<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { BranchFormType } from '@/core/BranchTypes';
import type { BranchFormatTemplate } from '@/core/FormatTypes';
import CustomSelect from '@/components/CustomSelect.vue';
import { segmentColor } from '@/utils/segmentColor';

const props = defineProps<{
  formats: BranchFormatTemplate[];
  formatId: string;
  modelValue: BranchFormType;
}>();

const emit = defineEmits<{
  (e: 'update:formatId', id: string): void;
  (e: 'update:modelValue', values: BranchFormType): void;
  (e: 'submit'): void;
  (e: 'manage'): void;
}>();

const { t } = useI18n();

// Names and labels of the built-in formats are i18n keys (they contain a dot);
// the ones of custom formats are free text.
const resolveLabel = (value: string) => (value.includes('.') ? t(value) : value);

const format = computed(() => props.formats.find((f) => f.id === props.formatId) ?? null);
const formatOptions = computed(() =>
  props.formats.map((f) => ({ value: f.id, label: resolveLabel(f.name) })),
);

const setValue = (fieldId: string, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [fieldId]: value });
};
</script>

<template>
  <form
    class="wb-form"
    :aria-label="$t('form.formatLabel')"
    autocomplete="off"
    novalidate
    @submit.prevent="emit('submit')"
  >
    <div class="settings-card">
      <div class="card-head">
        <label class="card-title" for="branch-format-select">{{ $t('form.formatLabel') }}</label>
        <button type="button" class="link-btn" @click="emit('manage')">
          {{ $t('form.manage') }}
        </button>
      </div>

      <CustomSelect
        id="branch-format-select"
        :model-value="formatId"
        :options="formatOptions"
        @update:model-value="emit('update:formatId', $event)"
      />
      <p v-if="format" class="format-meta">{{ format.templateString }}</p>

      <template v-if="format">
        <hr class="divider" />
        <div class="fields">
          <div v-for="(field, index) in format.fields" :key="field.id" class="field">
            <label class="field-label" :for="`branch-field-${field.id}`">
              <span class="dot" :style="{ '--c': segmentColor(index) }"></span>
              {{ resolveLabel(field.label) }}
            </label>

            <CustomSelect
              v-if="field.type === 'select' && field.options"
              :id="`branch-field-${field.id}`"
              :name="field.id"
              :model-value="modelValue[field.id] ?? ''"
              :options="field.options.map((option) => ({ value: option, label: option }))"
              @update:model-value="setValue(field.id, $event)"
            />
            <input
              v-else
              :id="`branch-field-${field.id}`"
              class="input-element"
              type="text"
              :name="field.id"
              :value="modelValue[field.id] ?? ''"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              data-1p-ignore="true"
              @input="setValue(field.id, ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </template>
    </div>
  </form>
</template>
