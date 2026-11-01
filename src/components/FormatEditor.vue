<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  BranchFormatTemplate,
  Capitalization,
  FieldDefinition,
  LanguageProfile,
} from '@/core/FormatTypes';
import { checkTemplate } from '@/core/FormatTemplate';
import AppIcon from '@/components/AppIcon.vue';
import CustomSelect from '@/components/CustomSelect.vue';
import FormatPreview from '@/components/FormatPreview.vue';
import { segmentColor } from '@/utils/segmentColor';

const props = defineProps<{
  format: BranchFormatTemplate;
}>();

const emit = defineEmits<{
  (e: 'save', format: BranchFormatTemplate): void;
  (e: 'cancel'): void;
  (e: 'dirty-change', dirty: boolean): void;
}>();

const { t } = useI18n();

const snapshot = (format: BranchFormatTemplate) => JSON.stringify(format);
const original = snapshot(props.format);
const localFormat = ref<BranchFormatTemplate>(JSON.parse(original));
const samples = ref<Record<string, string>>({});

// Names and labels coming from a built-in format are i18n keys (they contain a
// dot); the ones the user writes are shown as they are.
const resolveLabel = (value: string) => (value.includes('.') ? t(value) : value);
const token = (id: string) => `{${id}}`;

const capitalizationOptions = computed<{ value: Capitalization; label: string }[]>(() => [
  { value: 'UPPERCASE', label: t('configurator.editor.capUpper') },
  { value: 'LOWERCASE', label: t('configurator.editor.capLower') },
  { value: 'AS_IS', label: t('configurator.editor.capAsIs') },
]);

const languageOptions: { value: LanguageProfile; label: string }[] = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
];

const typeOptions = computed(() => [
  { value: 'text', label: t('configurator.editor.typeText') },
  { value: 'select', label: t('configurator.editor.typeSelect') },
]);

watch(
  localFormat,
  (value) => {
    emit('dirty-change', snapshot(value) !== original);
  },
  { deep: true },
);

const issues = computed(() => checkTemplate(localFormat.value));
const asTokens = (ids: string[]) => ids.map((id) => `{${id}}`).join(', ');
const warnings = computed(() => {
  const list: string[] = [];
  if (issues.value.unknownTokens.length) {
    list.push(t('formats.warnUnknown', { tokens: asTokens(issues.value.unknownTokens) }));
  }
  if (issues.value.unusedFields.length) {
    list.push(t('formats.warnUnused', { fields: asTokens(issues.value.unusedFields) }));
  }
  if (issues.value.duplicateFields.length) {
    list.push(t('formats.warnDuplicate', { ids: asTokens(issues.value.duplicateFields) }));
  }
  return list;
});

const addField = () => {
  localFormat.value.fields.push({
    id: `campo${localFormat.value.fields.length + 1}`,
    label: t('configurator.newFieldLabel'),
    capitalization: 'AS_IS',
    type: 'text',
  });
};

const removeField = (index: number) => {
  localFormat.value.fields.splice(index, 1);
};

const rawOptionsMap = ref(new Map<FieldDefinition, string>());

const getOptionsText = (field: FieldDefinition) => {
  if (rawOptionsMap.value.has(field)) {
    return rawOptionsMap.value.get(field)!;
  }
  return (field.options || []).join(', ');
};

const updateOptions = (field: FieldDefinition, event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  rawOptionsMap.value.set(field, value);
  field.options = value
    .split(',')
    .map((option) => option.trim())
    .filter(Boolean);
};
</script>

<template>
  <div class="editor">
    <FormatPreview v-model:samples="samples" :format="localFormat" />

    <div class="ed-grid two">
      <div class="ed-field">
        <label for="format-name-input" class="ed-label">{{
          $t('configurator.editor.formatName')
        }}</label>
        <input
          id="format-name-input"
          type="text"
          class="input-element"
          :value="resolveLabel(localFormat.name)"
          @input="localFormat.name = ($event.target as HTMLInputElement).value"
        />
      </div>
      <div class="ed-field">
        <span class="ed-label">{{ $t('configurator.editor.language') }}</span>
        <CustomSelect
          :model-value="localFormat.language"
          :options="languageOptions"
          @update:model-value="localFormat.language = $event as LanguageProfile"
        />
      </div>
    </div>

    <div class="ed-field template-field">
      <label for="format-template-input" class="ed-label">{{
        $t('configurator.editor.template')
      }}</label>
      <input
        id="format-template-input"
        v-model="localFormat.templateString"
        type="text"
        class="input-element mono"
        spellcheck="false"
        :aria-describedby="warnings.length ? 'format-template-warnings' : 'format-template-help'"
      />
      <p id="format-template-help" class="ed-help">{{ $t('formats.templateHelp') }}</p>
      <div v-if="warnings.length" id="format-template-warnings" role="status">
        <p v-for="warning in warnings" :key="warning" class="ed-help ed-warn">
          <AppIcon name="alert" class="warn-ico" />
          {{ warning }}
        </p>
      </div>
    </div>

    <div class="ed-section">
      <div class="ed-section-head">
        <h4 class="ed-label">{{ $t('configurator.editor.fields') }}</h4>
        <button type="button" class="btn-secondary with-ico" @click="addField">
          <AppIcon name="plus" />
          {{ $t('configurator.editor.addField') }}
        </button>
      </div>

      <div v-for="(field, index) in localFormat.fields" :key="index" class="fld-card">
        <div class="fld-head">
          <span class="dot" :style="{ '--c': segmentColor(index) }"></span>
          <span class="card-title">{{ $t('configurator.editor.field', { n: index + 1 }) }}</span>
          <span class="tok-chip" :style="{ '--c': segmentColor(index) }">{{
            token(field.id)
          }}</span>
          <span class="spacer"></span>
          <button
            type="button"
            class="icon-btn danger"
            :aria-label="`${$t('configurator.editor.deleteField')} ${index + 1}`"
            :title="$t('configurator.editor.deleteField')"
            @click="removeField(index)"
          >
            <AppIcon name="trash" />
          </button>
        </div>

        <div class="fld-grid two">
          <div class="ed-field">
            <label :for="`field-id-${index}`" class="ed-label">{{
              $t('configurator.editor.fieldId')
            }}</label>
            <input
              :id="`field-id-${index}`"
              v-model="field.id"
              type="text"
              class="input-element mono"
              spellcheck="false"
              :placeholder="$t('configurator.editor.fieldIdPlaceholder')"
            />
          </div>
          <div class="ed-field">
            <label :for="`field-label-${index}`" class="ed-label">{{
              $t('configurator.editor.fieldLabel')
            }}</label>
            <input
              :id="`field-label-${index}`"
              type="text"
              class="input-element"
              :value="resolveLabel(field.label)"
              :placeholder="$t('configurator.editor.fieldLabelPlaceholder')"
              @input="field.label = ($event.target as HTMLInputElement).value"
            />
          </div>
          <div class="ed-field">
            <span class="ed-label">{{ $t('configurator.editor.type') }}</span>
            <CustomSelect
              :model-value="field.type || 'text'"
              size="sm"
              :options="typeOptions"
              @update:model-value="field.type = $event as 'text' | 'select'"
            />
          </div>
          <div class="ed-field">
            <span class="ed-label">{{ $t('configurator.editor.capitalization') }}</span>
            <CustomSelect
              v-model="field.capitalization"
              size="sm"
              :options="capitalizationOptions"
            />
          </div>
        </div>

        <div v-if="field.type === 'select'" class="field-options-control fld-opts">
          <label :for="`field-options-${index}`" class="ed-label">{{
            $t('configurator.editor.options')
          }}</label>
          <input
            :id="`field-options-${index}`"
            type="text"
            class="input-element"
            :value="getOptionsText(field)"
            :placeholder="$t('configurator.editor.optionsPlaceholder')"
            @input="updateOptions(field, $event)"
          />
        </div>
      </div>
    </div>

    <div class="ed-actions">
      <button type="button" class="btn-secondary" @click="emit('cancel')">
        {{ $t('configurator.editor.cancel') }}
      </button>
      <button type="button" class="btn-primary" @click="emit('save', localFormat)">
        {{ $t('configurator.editor.save') }}
      </button>
    </div>
  </div>
</template>
