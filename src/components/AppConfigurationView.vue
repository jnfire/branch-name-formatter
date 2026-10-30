<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { FormatManager } from '@/core/FormatManager'
import type { BranchFormatTemplate } from '@/core/FormatTypes'
import FormatPreview from '@/components/FormatPreview.vue'
import FormatEditor from '@/components/FormatEditor.vue'
import CustomModal from '@/components/CustomModal.vue'
import PersonalizationCard from '@/components/PersonalizationCard.vue'

defineProps<{
  languages: { code: string; label: string }[];
}>()

defineEmits(['close'])

const { t, locale } = useI18n()

const formats = ref<BranchFormatTemplate[]>([])
const editingFormat = ref<BranchFormatTemplate | null>(null)
const previewFormat = ref<BranchFormatTemplate | null>(null)
const defaultFormatId = ref<string | null>(null)

const showDeleteModal = ref(false)
const formatToDelete = ref<string | null>(null)

const loadFormats = () => {
  formats.value = FormatManager.getFormats()
}

onMounted(() => {
  loadFormats()
  if (formats.value.length > 0) {
    const storedDefaultId = FormatManager.getDefaultFormatId()
    const storedDefault = formats.value.find(f => f.id === storedDefaultId)
    previewFormat.value = storedDefault || formats.value[0]
    defaultFormatId.value = previewFormat.value.id
  }
})

// Devuelve el formato que debe verse en la previsualización cuando no hay uno
// explícito que mostrar (tras cerrar el editor, borrar, etc.): el predeterminado
// actual si sigue existiendo, o si no el primero de la lista.
const getPreviewFallback = (): BranchFormatTemplate | null => {
  return formats.value.find(f => f.id === defaultFormatId.value) || formats.value[0] || null
}

// Al hacer clic en una tarjeta se previsualiza y, a la vez, se marca como
// el formato predeterminado de la app.
const selectFormat = (format: BranchFormatTemplate) => {
  previewFormat.value = format
  defaultFormatId.value = format.id
  FormatManager.setDefaultFormatId(format.id)
}

const handleEdit = (format: BranchFormatTemplate) => {
  editingFormat.value = format
  previewFormat.value = format
}

const handleClone = (formatId: string) => {
  const resolveLabel = (value: string) => value.includes('.') ? t(value) : value
  const cloned = FormatManager.cloneFormat(formatId, resolveLabel, t('configurator.cloneSuffix'))
  if (cloned) {
    loadFormats()
    handleEdit(cloned)
  }
}

// Recarga la lista y refresca el formato que se está editando/previsualizando
// tras un cambio persistido fuera del flujo normal de Guardar (toggles instantáneos).
const refreshEditingFormat = (id: string) => {
  loadFormats()
  const refreshed = formats.value.find(f => f.id === id) || null
  editingFormat.value = refreshed
  previewFormat.value = refreshed
}

const handleUpdateLanguageInEditor = (language: BranchFormatTemplate['language']) => {
  if (!editingFormat.value) return
  FormatManager.setLanguage(editingFormat.value.id, language)
  refreshEditingFormat(editingFormat.value.id)
}

const promptDelete = (formatId: string) => {
  formatToDelete.value = formatId
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (formatToDelete.value) {
    FormatManager.deleteFormat(formatToDelete.value)
    loadFormats()
    if (defaultFormatId.value === formatToDelete.value) {
      defaultFormatId.value = formats.value[0]?.id ?? null
      FormatManager.setDefaultFormatId(defaultFormatId.value ?? '')
    }
    if (previewFormat.value?.id === formatToDelete.value) {
      previewFormat.value = getPreviewFallback()
    }
  }
  formatToDelete.value = null
}

const cancelDelete = () => {
  formatToDelete.value = null
}

const startNewFormat = () => {
  const newFormat: BranchFormatTemplate = {
    id: `custom-${Date.now()}`,
    name: t('configurator.newFormatName'),
    templateString: '{campo1}-{campo2}',
    isReadonly: false,
    language: locale.value as BranchFormatTemplate['language'],
    fields: [
      { id: 'campo1', label: `${t('configurator.newFieldLabel')} 1`, type: 'text', capitalization: 'LOWERCASE' },
      { id: 'campo2', label: `${t('configurator.newFieldLabel')} 2`, type: 'text', capitalization: 'LOWERCASE' }
    ]
  }
  editingFormat.value = newFormat
  previewFormat.value = newFormat
}

const handleSave = (savedFormat: BranchFormatTemplate) => {
  const exists = formats.value.some(f => f.id === savedFormat.id)
  if (exists) {
    FormatManager.updateFormat(savedFormat)
  } else {
    FormatManager.addFormat(savedFormat)
  }
  editingFormat.value = null
  loadFormats()
  previewFormat.value = savedFormat
}

const handleCancel = () => {
  editingFormat.value = null
  previewFormat.value = getPreviewFallback()
}

const updatePreview = (format: BranchFormatTemplate) => {
  previewFormat.value = format
}

// Import/Export
const handleExport = () => {
  const dataStr = FormatManager.exportConfiguration()
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  const exportFileDefaultName = 'branch-formats.json'
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

const handleImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const jsonStr = e.target?.result as string
      FormatManager.importCustomFormats(jsonStr)
      loadFormats()
      alert(t('configurator.importSuccess'))
    } catch {
      alert(t('configurator.importError'))
    }
  }
  reader.readAsText(file)
  target.value = '' // reset input
}

const fileInputRef = ref<HTMLInputElement | null>(null);

const triggerFileInput = (keyboardEvent: KeyboardEvent) => {
  keyboardEvent.preventDefault();
  fileInputRef.value?.click();
};
</script>

<template>
  <div class="configuration-view container-wide">
    <!-- Format Configuration Card -->
    <div class="config-card">
      <FormatPreview :format="previewFormat" />

      <div v-if="editingFormat">
        <FormatEditor
          :format="editingFormat"
          @update:format="updatePreview"
          @save="handleSave"
          @cancel="handleCancel"
          @update-language="handleUpdateLanguageInEditor"
        />
      </div>

      <div v-else class="formats-list-section">
        <div class="list-header">
          <h3 class="section-title">{{ $t('configurator.availableFormats') }}</h3>
          <button type="button" class="btn-primary" @click="startNewFormat">{{ $t('configurator.createFormat') }}</button>
        </div>

        <div class="format-items" role="radiogroup" :aria-label="$t('configurator.availableFormats')">
          <div
            v-for="format in formats"
            :key="format.id"
            role="radio"
            :aria-checked="format.id === defaultFormatId"
            :aria-label="`${format.name.includes('.') ? $t(format.name) : format.name} - ${format.templateString}`"
            tabindex="0"
            class="format-card"
            :class="{
              'format-card--selected': format.id === defaultFormatId
            }"
            @click="selectFormat(format)"
            @keydown.enter="selectFormat(format)"
            @keydown.space.prevent="selectFormat(format)"
          >
            <div class="format-info">
              <span class="format-name">
                {{ format.name.includes('.') ? $t(format.name) : format.name }}
                <span v-if="format.isReadonly" class="badge">{{ $t('configurator.badgeBuiltin') }}</span>
                <span v-if="format.id === defaultFormatId" class="badge badge--selected">{{ $t('configurator.badgeSelected') }}</span>
              </span>
              <code class="format-template">{{ format.templateString }}</code>
            </div>
            <div class="format-actions" @click.stop>
              <button 
                type="button" 
                class="btn-secondary small-btn" 
                :aria-label="`${$t('configurator.edit')}: ${format.name.includes('.') ? $t(format.name) : format.name}`"
                @click="handleEdit(format)"
              >
                {{ $t('configurator.edit') }}
              </button>
              <button 
                v-if="format.isReadonly" 
                type="button" 
                class="btn-secondary small-btn" 
                :aria-label="`${$t('configurator.clone')}: ${format.name.includes('.') ? $t(format.name) : format.name}`"
                @click="handleClone(format.id)"
              >
                {{ $t('configurator.clone') }}
              </button>
              <button 
                v-else 
                type="button" 
                class="btn-secondary small-btn delete-btn" 
                :aria-label="`${$t('configurator.delete')}: ${format.name.includes('.') ? $t(format.name) : format.name}`"
                @click="promptDelete(format.id)"
              >
                {{ $t('configurator.delete') }}
              </button>
            </div>
          </div>
        </div>

        <div class="import-export-section">
          <button type="button" class="btn-secondary import-export-btn" @click="handleExport">{{ $t('configurator.exportCustom') }}</button>
          <label
            class="btn-secondary file-upload-btn import-export-btn"
            tabindex="0"
            role="button"
            @keydown.enter="triggerFileInput"
            @keydown.space.prevent="triggerFileInput"
          >
            {{ $t('configurator.importJson') }}
            <input ref="fileInputRef" type="file" accept=".json" class="sr-only" @change="handleImport" />
          </label>
        </div>
      </div>
    </div>

    <!-- Personalization / System Settings Card -->
    <PersonalizationCard :languages="languages" />

    <CustomModal
      v-model="showDeleteModal"
      :title="$t('configurator.deleteModal.title')"
      :message="$t('configurator.deleteModal.message')"
      :confirmText="$t('configurator.delete')"
      :cancelText="$t('common.cancel')"
      :danger="true"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<style scoped lang="scss">
.configuration-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.config-card {
  background-color: var(--bg-surface);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  @media (max-width: vars.$bp-mobile) {
    padding: 1.5rem;
  }
}

.section-title {
  margin: 0;
  color: var(--text-main);
  font-size: 1.15rem;
  font-weight: 600;
}



.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: vars.$bp-mobile) {
    flex-direction: column;
    align-items: flex-start;

    .btn-primary {
      width: 100%;
    }
  }
}

.format-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.format-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-surface);
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--text-main);
  }

  &--selected {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 1px var(--accent-color);
  }

  @media (min-width: vars.$bp-mobile) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.format-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.format-name {
  font-weight: 600;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 9999px;
  background-color: var(--border-color);
  color: var(--text-muted);

  &--selected {
    background-color: var(--accent-color);
    color: var(--bg-body);
  }
}

.format-template {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.format-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  justify-content: space-between;

  @media (min-width: vars.$bp-mobile) {
    width: auto;
    justify-content: flex-end;
  }
}

.small-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
}

.delete-btn {
  color: #ef4444;
  border-color: #fca5a5;
  &:hover {
    background-color: #fee2e2;
  }
}

.import-export-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.import-export-btn {
  flex: 1;
  max-width: 200px;
  text-align: center;
  justify-content: center;
  display: inline-flex;
  align-items: center;
}

.file-upload-btn {
  cursor: pointer;
  margin: 0;
}

.format-card:focus-visible,
.file-upload-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}
</style>
