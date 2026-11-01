<script setup lang="ts">
import type { NameSegment } from '@/core/BranchFormatter';
import AppIcon from '@/components/AppIcon.vue';
import BranchName from '@/components/BranchName.vue';

defineProps<{
  segments: NameSegment[];
  placeholders: string[];
  /** True when every field is filled in and there is a name to copy. */
  canCopy: boolean;
  copied: boolean;
  name: string;
}>();

const emit = defineEmits<{ (e: 'copy'): void }>();
</script>

<template>
  <section class="wb-output" :aria-label="$t('output.title')">
    <div class="settings-card">
      <div class="card-head">
        <span class="card-title">{{ $t('output.title') }}</span>
      </div>

      <BranchName :segments="segments" :placeholders="canCopy ? undefined : placeholders" />

      <div class="output-actions">
        <button
          type="button"
          class="btn-primary"
          :disabled="!canCopy"
          :aria-label="canCopy ? `${$t('output.copy')}: ${name}` : $t('output.copy')"
          @click="emit('copy')"
        >
          <AppIcon :name="copied ? 'check' : 'copy'" :stroke-width="copied ? 2.4 : 2" />
          {{ copied ? $t('output.copied') : $t('output.copy') }}
        </button>
        <p class="hint">
          {{ canCopy ? $t('output.hintReady') : $t('output.hintIncomplete') }}
        </p>
      </div>

      <div class="sr-only" role="status" aria-live="polite">
        {{ copied ? $t('output.copied') : '' }}
      </div>
    </div>
  </section>
</template>
