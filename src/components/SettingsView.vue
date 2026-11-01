<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue';
import BackupCard from '@/components/BackupCard.vue';
import PersonalizationCard from '@/components/PersonalizationCard.vue';
import { useRoute } from '@/composables/useRoute';

const { goHome } = useRoute();
</script>

<template>
  <div class="st-page">
    <div class="st-head">
      <h2>{{ $t('settings.title') }}</h2>
      <button type="button" class="link-btn back-link" @click="goHome">
        <AppIcon name="back" />
        {{ $t('nav.backToGenerator') }}
      </button>
    </div>
    <div class="st-row2">
      <PersonalizationCard />
      <BackupCard />
    </div>
  </div>
</template>
