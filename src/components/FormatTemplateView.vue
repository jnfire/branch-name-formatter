<script setup lang="ts">
import { computed } from 'vue';
import { segmentColor } from '@/utils/segmentColor';

const props = defineProps<{
  templateString: string;
  /** Ids of the fields, in order; the position gives each token its color. */
  fieldIds: string[];
}>();

const parts = computed(() =>
  props.templateString
    .split(/(\{[^{}]+\})/g)
    .filter(Boolean)
    .map((text) => {
      const index = props.fieldIds.indexOf(text.slice(1, -1));
      const isToken = /^\{[^{}]+\}$/.test(text) && index !== -1;
      return { text, index: isToken ? index : null };
    }),
);
</script>

<template>
  <code class="tpl">
    <template v-for="(part, position) in parts" :key="position">
      <span v-if="part.index === null" class="sep">{{ part.text }}</span>
      <span v-else class="tok" :style="{ '--c': segmentColor(part.index) }">{{ part.text }}</span>
    </template>
  </code>
</template>
