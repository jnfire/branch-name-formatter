<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { BranchFormType } from '@/core/BranchTypes'
import type { BranchFormatTemplate } from '@/core/FormatTypes'
import { FormatManager } from '@/core/FormatManager'
import CustomSelect from '@/components/CustomSelect.vue'

const emit = defineEmits(['submitForm'])

const { t } = useI18n()

const formats = ref<BranchFormatTemplate[]>([])
const selectedFormatId = ref<string>('')
const formData = ref<Record<string, string>>({})
const formError = ref<string>('')

const loadSelectedFormat = () => {
  formats.value = FormatManager.getFormats()
  if (formats.value.length > 0) {
    const defaultId = FormatManager.getDefaultFormatId()
    const defaultStillAvailable = formats.value.some(f => f.id === defaultId)
    selectedFormatId.value = defaultStillAvailable ? defaultId! : formats.value[0].id
  }
}

onMounted(() => {
  loadSelectedFormat()
})

const selectedFormat = computed(() => {
  return formats.value.find(f => f.id === selectedFormatId.value) || null
})

watch(selectedFormatId, () => {
  formData.value = {}
  formError.value = ''
  // Initialize default values for select fields
  if (selectedFormat.value) {
    selectedFormat.value.fields.forEach(field => {
      if (field.type === 'select' && field.options && field.options.length > 0) {
        formData.value[field.id] = field.options[0]
      }
    })
  }
})

const handleSubmit = (event: Event) => {
  event.preventDefault()

  if (!validateInput()) {
    formError.value = t('form.errorRequired')
    return
  }

  formError.value = ''
  if (selectedFormat.value) {
    emit('submitForm', selectedFormat.value, { ...formData.value } as BranchFormType)
    cleanInput()
  }
}

function validateInput() {
  if (!selectedFormat.value) return false
  for (const field of selectedFormat.value.fields) {
    if (!formData.value[field.id] || !formData.value[field.id].trim()) return false
  }
  return true
}

function cleanInput() {
  formData.value = {}
  formError.value = ''
  // Re-initialize default values for select fields
  if (selectedFormat.value) {
    selectedFormat.value.fields.forEach((fieldItem) => {
      if (fieldItem.type === 'select' && fieldItem.options && fieldItem.options.length > 0) {
        formData.value[fieldItem.id] = fieldItem.options[0]
      }
    })
  }
}
</script>

<template>
  <form class="form" :aria-label="$t('form.generate')" autocomplete="off" novalidate @submit="handleSubmit">

    <template v-if="selectedFormat">
      <div v-for="field in selectedFormat.fields" :key="field.id" class="form-group">
        <label :for="field.id" class="form-label">
           {{ field.label.includes('.') ? $t(field.label) : field.label }}
        </label>
        
        <CustomSelect
          v-if="field.type === 'select' && field.options"
          :id="field.id"
          v-model="formData[field.id]"
          :options="field.options.map((optionItem) => ({ value: optionItem, label: optionItem }))"
          :name="field.id"
          @update:model-value="formError = ''"
        />
        <input
          v-else
          :id="field.id"
          v-model="formData[field.id]"
          class="input-element"
          type="text"
          :name="field.id"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          data-1p-ignore="true"
          :aria-invalid="!!formError && (!formData[field.id] || !formData[field.id].trim())"
          :aria-describedby="formError ? 'branch-form-error' : undefined"
          @input="formError = ''"
        />
      </div>
    </template>

    <p v-if="formError" id="branch-form-error" class="error-msg" role="alert" aria-live="assertive">
      {{ formError }}
    </p>

    <button class="btn-primary generate-btn" type="submit">
      {{ $t('form.generate') }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-element {
  width: 100%;
}

.generate-btn {
  margin-top: 0.5rem;
  font-size: 1rem;
}
</style>
