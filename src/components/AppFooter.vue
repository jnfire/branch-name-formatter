<script setup lang="ts">
import { appConfig } from '../app.config';

defineProps<{
  /** Shows the methodology button; the app opens its sources dialog on `show-sources`. */
  showMethodology?: boolean;
}>();

const emit = defineEmits<{
  (e: 'show-sources'): void;
}>();

const appVersion = __APP_VERSION__;
const repositoryUrl = `https://github.com/${appConfig.repository}`;
</script>

<template>
  <footer class="footer">
    <div class="footer__content">
      <p class="footer__text">
        {{ $t('footer.facts') }}
        <span class="footer__version">
          •
          <a
            :href="`${repositoryUrl}/releases/tag/v${appVersion}`"
            target="_blank"
            rel="noopener noreferrer"
            class="footer__version-link"
          >
            v{{ appVersion }}
          </a>
        </span>
      </p>
      <div class="footer__links">
        <template v-if="showMethodology">
          <button type="button" class="footer__link btn-link" @click="emit('show-sources')">
            {{ $t('footer.methodology') }}
          </button>
          <span class="footer__divider">|</span>
        </template>
        <a :href="repositoryUrl" target="_blank" rel="noopener noreferrer" class="footer__link">
          {{ $t('footer.source') }}
        </a>
        <span class="footer__divider">|</span>
        <a
          :href="`${repositoryUrl}/blob/main/LICENSE`"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__link"
        >
          {{ $t('footer.license') }}
        </a>
      </div>
      <i18n-t keypath="footer.madeBy" tag="p" class="footer__text footer__author">
        <template #name>
          <a
            :href="appConfig.author.url"
            target="_blank"
            rel="noopener noreferrer"
            class="footer__link"
          >
            {{ appConfig.author.name }}
          </a>
        </template>
      </i18n-t>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 3rem 1.5rem;
  margin-top: 4rem;
  border-top: 1px solid var(--border-color);
}

.footer__content {
  text-align: center;
}

.footer__text {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.footer__version {
  /* Keep "• v1.0.0" together when the line wraps on a phone. */
  white-space: nowrap;
  opacity: 0.8;
}

.footer__version-link {
  color: inherit;
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer__version-link:hover {
  text-decoration: underline;
  opacity: 1;
}

.footer__links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}

.footer__link {
  color: var(--text-main);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s;
}

.footer__link:hover {
  opacity: 0.7;
}

.btn-link {
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  line-height: inherit;
  padding: 0;
}

.footer__divider {
  color: var(--border-color);
  font-size: 0.8rem;
}

.footer__author {
  margin-top: 0.75rem;
}
</style>
