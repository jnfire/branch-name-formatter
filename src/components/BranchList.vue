<script setup lang="ts">
import BranchItem from '@/components/BranchItem.vue';
import type { Branch } from '@/core/Branch.ts';

const props = defineProps<{
  branches: Branch[];
}>();

const emit = defineEmits(['deleteBranch']);

const handleDeleteBranch = (branchId: number) => {
  emit('deleteBranch', branchId);
};
</script>

<template>
  <ul class="branch_list" :aria-label="$t('history.title')">
    <li v-for="branch in props.branches" :key="branch.id" class="branch-item-wrapper">
      <BranchItem
        :branch-name="branch.branchName"
        :branch-id="branch.id"
        @deleteBranch="handleDeleteBranch"
      />
    </li>
  </ul>
</template>

<style scoped lang="scss">
.branch_list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  list-style: none;
  padding: 0;
}

.branch-item-wrapper {
  margin: 0;
  padding: 0;
}
</style>
