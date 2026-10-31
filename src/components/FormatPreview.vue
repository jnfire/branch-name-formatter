<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { BranchFormatTemplate } from '@/core/FormatTypes';
import { BranchFormatter } from '@/core/BranchFormatter';

const props = defineProps<{
  format: BranchFormatTemplate | null;
}>();

const { t } = useI18n();

const previewName = computed(() => {
  if (!props.format) return t('preview.placeholder');

  const fakeData: Record<string, string> = {};
  props.format.fields.forEach((f) => {
    fakeData[f.id] = f.id;
  });

  return BranchFormatter.format(props.format, fakeData);
});
</script>

<template>
  <div class="preview-box">
    <h3 class="preview-title">{{ $t('preview.title') }}</h3>
    <code class="preview-code">{{ previewName }}</code>
  </div>
</template>

<style scoped lang="scss">
.preview-box {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
}
.preview-title {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}
.preview-code {
  font-size: clamp(1rem, 0.85rem + 1vw, 1.25rem);
  font-weight: 600;
  color: var(--text-main);
  overflow-wrap: break-word;
  display: inline-block;
}
</style>
