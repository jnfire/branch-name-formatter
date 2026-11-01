<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/AppIcon.vue';
import CustomModal from '@/components/CustomModal.vue';
import FormatEditor from '@/components/FormatEditor.vue';
import FormatList from '@/components/FormatList.vue';
import FormatReadonly from '@/components/FormatReadonly.vue';
import { FormatManager } from '@/core/FormatManager';
import type { BranchFormatTemplate, LanguageProfile } from '@/core/FormatTypes';
import { setLeaveGuard, useRoute } from '@/composables/useRoute';

const DRAFT_ID = 'nuevo';

const { t, locale } = useI18n();
const { route, goHome, goFormats } = useRoute();

const formats = ref<BranchFormatTemplate[]>(FormatManager.getFormats());
const inUseId = ref<string | null>(null);
const draft = ref<BranchFormatTemplate | null>(null);
const dirty = ref(false);
const editorKey = ref(0);

const showDiscardModal = ref(false);
let pendingProceed: (() => void) | null = null;
const showDeleteModal = ref(false);
const formatToDelete = ref<BranchFormatTemplate | null>(null);

const resolveLabel = (value: string) => (value.includes('.') ? t(value) : value);

const loadFormats = () => {
  formats.value = FormatManager.getFormats();
};

const resolveInUse = () => {
  const stored = FormatManager.getDefaultFormatId();
  return formats.value.find((f) => f.id === stored)?.id ?? formats.value[0]?.id ?? null;
};

const requestedId = computed(() => (route.value.name === 'formats' ? route.value.formatId : null));
const isDraftRoute = computed(() => requestedId.value === DRAFT_ID);

const openFormat = computed<BranchFormatTemplate | null>(() => {
  if (isDraftRoute.value) return draft.value;
  return (
    formats.value.find((f) => f.id === requestedId.value) ??
    formats.value.find((f) => f.id === inUseId.value) ??
    formats.value[0] ??
    null
  );
});

// On narrow screens the list and the detail are separate steps.
const screen = computed(() => (requestedId.value ? 'detail' : 'list'));

const newDraft = (): BranchFormatTemplate => ({
  id: `custom-${Date.now()}`,
  name: t('configurator.newFormatName'),
  templateString: '{campo1}-{campo2}',
  isReadonly: false,
  language: locale.value as LanguageProfile,
  fields: [1, 2].map((n) => ({
    id: `campo${n}`,
    label: `${t('configurator.newFieldLabel')} ${n}`,
    type: 'text' as const,
    capitalization: 'LOWERCASE' as const,
  })),
});

watch(
  isDraftRoute,
  (isDraft) => {
    draft.value = isDraft ? (draft.value ?? newDraft()) : null;
  },
  { immediate: true },
);

// Opening another format starts with a clean editor.
watch(
  () => openFormat.value?.id,
  () => {
    dirty.value = false;
  },
);

const warnBeforeUnload = (event: BeforeUnloadEvent) => {
  if (!dirty.value) return;
  event.preventDefault();
  event.returnValue = '';
};

inUseId.value = resolveInUse();

onMounted(() => {
  setLeaveGuard({
    isDirty: () => dirty.value,
    ask: (proceed) => {
      pendingProceed = proceed;
      showDiscardModal.value = true;
    },
  });
  window.addEventListener('beforeunload', warnBeforeUnload);
});

onBeforeUnmount(() => {
  setLeaveGuard(null);
  window.removeEventListener('beforeunload', warnBeforeUnload);
});

const confirmDiscard = () => {
  dirty.value = false;
  const proceed = pendingProceed;
  pendingProceed = null;
  proceed?.();
};

const cancelDiscard = () => {
  pendingProceed = null;
};

const useFormat = (format: BranchFormatTemplate) => {
  FormatManager.setDefaultFormatId(format.id);
  inUseId.value = format.id;
};

const cloneFormat = (format: BranchFormatTemplate) => {
  const cloned = FormatManager.cloneFormat(format.id, resolveLabel, t('configurator.cloneSuffix'));
  if (!cloned) return;
  loadFormats();
  goFormats(cloned.id);
};

const askDelete = (format: BranchFormatTemplate) => {
  formatToDelete.value = format;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  const target = formatToDelete.value;
  formatToDelete.value = null;
  if (!target) return;
  FormatManager.deleteFormat(target.id);
  loadFormats();
  if (inUseId.value === target.id) {
    inUseId.value = formats.value[0]?.id ?? null;
    FormatManager.setDefaultFormatId(inUseId.value ?? '');
  }
  dirty.value = false;
  goFormats(null);
};

const saveFormat = (saved: BranchFormatTemplate) => {
  if (formats.value.some((f) => f.id === saved.id)) {
    FormatManager.updateFormat(saved);
  } else {
    FormatManager.addFormat(saved);
  }
  dirty.value = false;
  draft.value = null;
  loadFormats();
  goFormats(saved.id);
};

const cancelEditing = () => {
  dirty.value = false;
  if (isDraftRoute.value) {
    goFormats(null);
    return;
  }
  editorKey.value += 1;
};

const changeLanguage = (language: LanguageProfile) => {
  if (!openFormat.value) return;
  FormatManager.setLanguage(openFormat.value.id, language);
  loadFormats();
};

const backFromDetail = () => goFormats(null);
</script>

<template>
  <div class="fm-page" :data-screen="screen">
    <div class="st-head only-wide">
      <h2>{{ $t('formats.title') }}</h2>
      <button type="button" class="link-btn back-link" @click="goHome">
        <AppIcon name="back" />
        {{ $t('nav.backToGenerator') }}
      </button>
    </div>
    <div class="st-head only-narrow">
      <button
        type="button"
        class="link-btn back-link"
        @click="screen === 'list' ? goHome() : backFromDetail()"
      >
        <AppIcon name="back" />
        {{ screen === 'list' ? $t('nav.backToGenerator') : $t('nav.backToFormats') }}
      </button>
      <h2 v-if="screen === 'list'">{{ $t('formats.title') }}</h2>
    </div>

    <div class="fm-panes">
      <FormatList
        :formats="formats"
        :open-id="isDraftRoute ? null : (openFormat?.id ?? null)"
        :in-use-id="inUseId"
        @open="goFormats"
        @create="goFormats(DRAFT_ID)"
      />

      <section
        v-if="openFormat"
        class="settings-card fm-detail"
        :aria-label="resolveLabel(openFormat.name)"
      >
        <div class="dp-head">
          <div class="dp-title">
            <h3>{{ resolveLabel(openFormat.name) }}</h3>
            <span class="chip">{{
              openFormat.isReadonly ? $t('configurator.badgeBuiltin') : $t('formats.badgeCustom')
            }}</span>
            <span v-if="openFormat.id === inUseId" class="chip is-use">{{
              $t('configurator.badgeSelected')
            }}</span>
          </div>
          <div v-if="!isDraftRoute" class="dp-actions">
            <button
              v-if="openFormat.id !== inUseId"
              type="button"
              class="btn-secondary"
              @click="useFormat(openFormat)"
            >
              <AppIcon name="check" :stroke-width="2.4" />
              <span>{{ $t('formats.useThis') }}</span>
            </button>
            <button
              type="button"
              class="btn-secondary"
              :aria-label="openFormat.isReadonly ? undefined : $t('configurator.clone')"
              :title="openFormat.isReadonly ? undefined : $t('configurator.clone')"
              @click="cloneFormat(openFormat)"
            >
              <AppIcon name="copy" />
              <span :class="{ lbl: !openFormat.isReadonly }">{{
                openFormat.isReadonly ? $t('formats.cloneToEdit') : $t('configurator.clone')
              }}</span>
            </button>
            <button
              v-if="!openFormat.isReadonly"
              type="button"
              class="btn-secondary danger"
              :aria-label="$t('configurator.delete')"
              :title="$t('configurator.delete')"
              @click="askDelete(openFormat)"
            >
              <AppIcon name="trash" />
              <span class="lbl">{{ $t('configurator.delete') }}</span>
            </button>
          </div>
        </div>

        <FormatReadonly
          v-if="openFormat.isReadonly"
          :key="openFormat.id"
          :format="openFormat"
          @update-language="changeLanguage"
        />
        <FormatEditor
          v-else
          :key="`${openFormat.id}-${editorKey}`"
          :format="openFormat"
          @save="saveFormat"
          @cancel="cancelEditing"
          @dirty-change="dirty = $event"
        />
      </section>
    </div>

    <CustomModal
      v-model="showDiscardModal"
      :title="$t('formats.discard.title')"
      :message="$t('formats.discard.message')"
      :confirm-text="$t('formats.discard.confirm')"
      :cancel-text="$t('formats.discard.cancel')"
      :danger="true"
      @confirm="confirmDiscard"
      @cancel="cancelDiscard"
    />
    <CustomModal
      v-model="showDeleteModal"
      :title="$t('configurator.deleteModal.title')"
      :message="$t('configurator.deleteModal.message')"
      :confirm-text="$t('configurator.delete')"
      :cancel-text="$t('common.cancel')"
      :danger="true"
      @confirm="confirmDelete"
      @cancel="formatToDelete = null"
    />
  </div>
</template>
