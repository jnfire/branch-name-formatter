<script setup lang="ts">
import { computed } from 'vue';
import type { NameSegment } from '@/core/BranchFormatter';
import { segmentColor } from '@/utils/segmentColor';

const props = defineProps<{
  segments: NameSegment[];
  /** Text shown, dashed, in place of a field that is still empty. */
  placeholders?: string[];
}>();

const fullName = computed(() => props.segments.map((segment) => segment.text).join(''));
</script>

<template>
  <code class="output-name" :data-name="fullName">
    <template v-for="(segment, position) in segments" :key="position">
      <span v-if="segment.kind === 'text'" class="sep">{{ segment.text }}</span>
      <span v-else-if="segment.text" class="seg" :style="{ '--c': segmentColor(segment.index) }">{{
        segment.text
      }}</span>
      <span v-else-if="placeholders" class="seg ghost">{{ placeholders[segment.index] }}</span>
    </template>
  </code>
</template>
