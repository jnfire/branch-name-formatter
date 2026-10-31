<template>
  <div class="branch">
    <div class="branch__name">
      <p class="branch__name__text">{{ props.branchName }}</p>
    </div>
    <div class="branch__buttons">
      <button
        type="button"
        class="branch__button branch__button__copy"
        :aria-label="`${$t('history.copy')}: ${props.branchName}`"
        @click="copyToClipboard"
      >
        {{ $t('history.copy') }}
      </button>
      <button
        type="button"
        class="branch__button branch__button__delete"
        :aria-label="`${$t('history.delete')}: ${props.branchName}`"
        @click="deleteBranch"
      >
        {{ $t('history.delete') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  branchName: string;
  branchId: number;
}>();

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.branchName);
};

const emit = defineEmits(['deleteBranch']);

const deleteBranch = () => {
  emit('deleteBranch', props.branchId);
};
</script>

<style scoped lang="scss">
.branch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 20px;
  color: var(--text-main);
  transition: all 0.2s;

  @media (max-width: vars.$bp-mobile) {
    padding: 10px 15px;
    flex-direction: column;
    gap: 10px;
  }

  &:hover {
    background-color: var(--bg-surface-hover);
  }

  &__name {
    flex: 1;
    min-width: 0;

    @media (max-width: vars.$bp-mobile) {
      width: 100%;
      text-align: center;
    }

    &__text {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
  }

  &__buttons {
    display: flex;
    gap: 0.5rem;

    @media (max-width: vars.$bp-mobile) {
      width: 100%;
      justify-content: center;
    }
  }

  &__button {
    padding: 6px 12px;
    font-size: 0.85rem;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: opacity 0.2s;

    &:focus-visible {
      outline: 2px solid var(--accent-color);
      outline-offset: 2px;
    }

    &__copy {
      background-color: var(--text-main);
      color: var(--bg-body);

      &:hover {
        opacity: 0.9;
      }
    }

    &__delete {
      background-color: var(--error-color);
      color: #fff;

      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
