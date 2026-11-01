<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue';
import { copyText } from '@/utils/clipboard';

const props = defineProps<{
  branchName: string;
  branchId: number;
  /** The one just copied: it gets the accent border. */
  highlight?: boolean;
}>();

const emit = defineEmits(['deleteBranch']);

const copy = () => {
  void copyText(props.branchName);
};

const remove = () => {
  emit('deleteBranch', props.branchId);
};
</script>

<template>
  <li class="hist-row" :class="{ 'is-new': highlight }">
    <span class="hist-name" :title="branchName">{{ branchName }}</span>
    <button
      type="button"
      class="icon-btn"
      :aria-label="$t('history.copyItem', { name: branchName })"
      :title="$t('history.copy')"
      @click="copy"
    >
      <AppIcon name="copy" />
    </button>
    <button
      type="button"
      class="icon-btn danger"
      :aria-label="$t('history.deleteItem', { name: branchName })"
      :title="$t('history.delete')"
      @click="remove"
    >
      <AppIcon name="trash" />
    </button>
  </li>
</template>
