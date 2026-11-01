<script setup lang="ts">
import BranchItem from '@/components/BranchItem.vue';
import type { Branch } from '@/core/Branch.ts';

const props = defineProps<{
  branches: Branch[];
  /** Id of the branch to highlight, if any. */
  highlightId?: number | null;
}>();

const emit = defineEmits(['deleteBranch']);

const handleDeleteBranch = (branchId: number) => {
  emit('deleteBranch', branchId);
};
</script>

<template>
  <ul class="hist-list" :aria-label="$t('history.title')">
    <BranchItem
      v-for="branch in props.branches"
      :key="branch.id"
      :branch-name="branch.branchName"
      :branch-id="branch.id"
      :highlight="branch.id === highlightId"
      @deleteBranch="handleDeleteBranch"
    />
  </ul>
</template>
