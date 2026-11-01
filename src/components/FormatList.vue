<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/AppIcon.vue';
import FormatTemplateView from '@/components/FormatTemplateView.vue';
import type { BranchFormatTemplate } from '@/core/FormatTypes';

defineProps<{
  formats: BranchFormatTemplate[];
  /** Format shown in the detail pane. */
  openId: string | null;
  /** Format the generator uses. */
  inUseId: string | null;
}>();

const emit = defineEmits<{
  (e: 'open', id: string): void;
  (e: 'create'): void;
}>();

const { t } = useI18n();
const resolveLabel = (value: string) => (value.includes('.') ? t(value) : value);
</script>

<template>
  <section class="settings-card fm-list" :aria-label="$t('formats.listTitle')">
    <div class="st-card-head">
      <h3 class="section-title">{{ $t('formats.listTitle') }}</h3>
    </div>

    <div class="fmt-list">
      <button
        v-for="format in formats"
        :key="format.id"
        type="button"
        class="fm-row"
        :class="{ 'is-open': format.id === openId }"
        :aria-current="format.id === openId ? 'true' : undefined"
        @click="emit('open', format.id)"
      >
        <span class="fmt-name">
          {{ resolveLabel(format.name) }}
          <span v-if="!format.isReadonly" class="chip">{{ $t('formats.badgeCustom') }}</span>
          <span v-if="format.id === inUseId" class="chip is-use">{{
            $t('configurator.badgeSelected')
          }}</span>
        </span>
        <FormatTemplateView
          :template-string="format.templateString"
          :field-ids="format.fields.map((field) => field.id)"
        />
      </button>
    </div>

    <button type="button" class="btn-primary with-ico" @click="emit('create')">
      <AppIcon name="plus" />
      {{ $t('formats.create') }}
    </button>
  </section>
</template>
