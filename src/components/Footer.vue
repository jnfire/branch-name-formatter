<script setup lang="ts">
const appVersion = __APP_VERSION__
</script>

<template>
  <footer class="footer">
    <div class="footer__content">
      <p class="footer__text">
        {{ $t('footer.privacy') }}
        <span class="footer__version">
          •
          <a
            :href="`https://github.com/jnfire/branch-name-formatter/releases/tag/v${appVersion}`"
            target="_blank"
            rel="noopener noreferrer"
            class="footer__version-link"
          >
            v{{ appVersion }}
          </a>
        </span>
      </p>
      <div class="footer__links">
        <a
          href="https://github.com/jnfire/branch-name-formatter"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__link"
        >
          {{ $t('footer.sourceCode') }}
        </a>
        <span class="footer__divider">|</span>
        <a
          href="https://github.com/jnfire/branch-name-formatter/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__link"
        >
          {{ $t('footer.license') }}
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  padding: 3rem 1.5rem;
  margin-top: 4rem;
  border-top: 1px solid var(--border-color);

  &__content {
    text-align: center;
  }

  &__text {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  &__version {
    opacity: 0.8;
  }

  &__version-link {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.2s;

    &:hover {
      text-decoration: underline;
      opacity: 1;
    }
  }

  &__links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    align-items: center;
  }

  &__link {
    color: var(--text-main);
    font-size: 0.85rem;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }

  &__divider {
    color: var(--border-color);
    font-size: 0.8rem;
  }
}
</style>
