<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import AppIcon from '@/components/AppIcon.vue';
import BranchForm from '@/components/BranchForm.vue';
import BranchList from '@/components/BranchList.vue';
import BranchOutput from '@/components/BranchOutput.vue';
import { BranchFormatter } from '@/core/BranchFormatter';
import { BranchManager } from '@/core/BranchManager';
import { FormatManager } from '@/core/FormatManager';
import type { Branch } from '@/core/Branch';
import type { BranchFormType } from '@/core/BranchTypes';
import type { BranchFormatTemplate } from '@/core/FormatTypes';
import { useRoute } from '@/composables/useRoute';
import { copyText } from '@/utils/clipboard';
import { useI18n } from 'vue-i18n';

const MAX_HISTORY = 10;
const COPIED_FEEDBACK_MS = 2000;

const { t } = useI18n();
const { goFormats } = useRoute();
const branchManager = BranchManager.getInstance();

const formats = ref<BranchFormatTemplate[]>(FormatManager.getFormats());
const formatId = ref<string>('');
const values = ref<BranchFormType>({});
const branches = ref<Branch[]>(branchManager.getBranches());
const historyOpen = ref(false);
const copied = ref(false);
const justAddedId = ref<number | null>(null);
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

// The format chosen last time, if it still exists; otherwise the first one.
const storedId = FormatManager.getDefaultFormatId();
formatId.value = formats.value.some((f) => f.id === storedId) ? storedId! : formats.value[0].id;

const format = computed(
  () => formats.value.find((f) => f.id === formatId.value) ?? formats.value[0],
);

const resolveLabel = (value: string) => (value.includes('.') ? t(value) : value);

// Selects start with their first option; everything else starts empty.
const initialValues = (template: BranchFormatTemplate): BranchFormType => {
  const initial: BranchFormType = {};
  for (const field of template.fields) {
    if (field.type === 'select' && field.options?.length) initial[field.id] = field.options[0];
  }
  return initial;
};

watch(
  format,
  (template) => {
    values.value = initialValues(template);
    copied.value = false;
  },
  { immediate: true },
);

const complete = computed(() =>
  format.value.fields.every((field) => (values.value[field.id] ?? '').trim() !== ''),
);
const name = computed(() => BranchFormatter.format(format.value, values.value));
const canCopy = computed(() => complete.value && name.value !== '');
const segments = computed(() =>
  BranchFormatter.formatSegments(format.value, values.value, complete.value),
);
const placeholders = computed(() => format.value.fields.map((field) => resolveLabel(field.label)));

const chooseFormat = (id: string) => {
  formatId.value = id;
  FormatManager.setDefaultFormatId(id);
};

const saveToHistory = () => {
  const latest = branches.value[0];
  if (latest?.branchName !== name.value) {
    branchManager.createBranch({ branchName: name.value, formatId: format.value.id });
    branches.value = [...branchManager.getBranches()];
  }
  justAddedId.value = branches.value[0]?.id ?? null;
};

const copyName = async () => {
  if (!canCopy.value) return;
  const done = await copyText(name.value);
  if (!done) return;
  saveToHistory();
  copied.value = true;
  clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => {
    copied.value = false;
    justAddedId.value = null;
  }, COPIED_FEEDBACK_MS);
};

const deleteBranch = (branchId: number) => {
  branchManager.deleteBranch(branchId);
  branches.value = [...branchManager.getBranches()];
};

onBeforeUnmount(() => clearTimeout(copiedTimer));
</script>

<template>
  <div class="workbench">
    <BranchForm
      v-model="values"
      :formats="formats"
      :format-id="formatId"
      @update:format-id="chooseFormat"
      @submit="copyName"
      @manage="goFormats(null)"
    />

    <BranchOutput
      :segments="segments"
      :placeholders="placeholders"
      :can-copy="canCopy"
      :copied="copied"
      :name="name"
      @copy="copyName"
    />

    <section
      class="wb-history"
      :class="{ 'is-closed': !historyOpen }"
      :aria-label="$t('history.title')"
    >
      <div class="settings-card">
        <button
          type="button"
          class="hist-toggle"
          :aria-expanded="historyOpen"
          aria-controls="history-list-pane"
          @click="historyOpen = !historyOpen"
        >
          <span class="card-title">
            {{ $t('history.title') }}
            <span class="badge-count">{{ branches.length }}</span>
          </span>
          <AppIcon name="chevron" class="hist-chevron" />
        </button>
        <div class="card-head">
          <span class="card-title">{{ $t('history.title') }}</span>
          <span class="badge-count">{{
            $t('history.count', { count: branches.length, max: MAX_HISTORY })
          }}</span>
        </div>

        <div id="history-list-pane">
          <BranchList
            v-if="branches.length"
            :branches="branches"
            :highlight-id="copied ? justAddedId : null"
            @deleteBranch="deleteBranch"
          />
          <p v-else class="hist-empty">{{ $t('history.empty') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
