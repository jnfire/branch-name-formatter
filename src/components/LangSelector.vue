<!-- src/components/LangSelector.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import FlagIcon from './FlagIcon.vue';

const props = defineProps<{
  modelValue: string;
  options: { code: string; label: string }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const optionRefs = ref<HTMLButtonElement[]>([]);

const currentLabel = computed(() => {
  const found = props.options.find((opt) => opt.code === props.modelValue);
  return found ? found.label : props.modelValue;
});

const setOptionRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  if (el instanceof HTMLButtonElement) optionRefs.value[index] = el;
};

const openDropdown = async () => {
  isOpen.value = true;
  await nextTick();
  const selectedIndex = props.options.findIndex((opt) => opt.code === props.modelValue);
  optionRefs.value[selectedIndex >= 0 ? selectedIndex : 0]?.focus();
};

const closeDropdown = (returnFocus = true) => {
  isOpen.value = false;
  if (returnFocus) triggerRef.value?.focus();
};

const toggleDropdown = () => {
  if (isOpen.value) {
    closeDropdown(false);
  } else {
    openDropdown();
  }
};

const selectOption = (code: string) => {
  emit('update:modelValue', code);
  closeDropdown();
};

// Moves focus between options with the arrow keys (roving focus), wrapping
// around at the edges, so keyboard users never get stuck in the listbox.
const focusOptionByOffset = (currentIndex: number, offset: number) => {
  const count = props.options.length;
  const nextIndex = (currentIndex + offset + count) % count;
  optionRefs.value[nextIndex]?.focus();
};

const handleOptionKeydown = (event: KeyboardEvent, index: number) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      focusOptionByOffset(index, 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusOptionByOffset(index, -1);
      break;
    case 'Home':
      event.preventDefault();
      optionRefs.value[0]?.focus();
      break;
    case 'End':
      event.preventDefault();
      optionRefs.value[props.options.length - 1]?.focus();
      break;
    case 'Escape':
      event.preventDefault();
      closeDropdown();
      break;
    case 'Tab':
      closeDropdown(false);
      break;
  }
};

const handleTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    openDropdown();
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="containerRef" class="lang-selector-container">
    <button
      ref="triggerRef"
      type="button"
      class="lang-selector-trigger"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggleDropdown"
      @keydown="handleTriggerKeydown"
    >
      <FlagIcon :code="modelValue" />
      <span class="lang-label">{{ currentLabel }}</span>
      <span class="dropdown-arrow" :class="{ 'arrow-open': isOpen }" aria-hidden="true">▾</span>
    </button>

    <transition name="fade-slide">
      <ul v-if="isOpen" class="lang-selector-dropdown" role="listbox">
        <li v-for="(opt, index) in options" :key="opt.code" role="presentation">
          <button
            :ref="(el) => setOptionRef(el, index)"
            type="button"
            class="lang-option"
            :class="{ 'option-selected': opt.code === modelValue }"
            role="option"
            :aria-selected="opt.code === modelValue"
            :tabindex="opt.code === modelValue ? 0 : -1"
            @click="selectOption(opt.code)"
            @keydown="handleOptionKeydown($event, index)"
          >
            <FlagIcon :code="opt.code" />
            <span>{{ opt.label }}</span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.lang-selector-container {
  position: relative;
  display: block;
  width: 100%;
}

.lang-selector-trigger {
  background: var(--bg-body);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.85rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-family: inherit;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  transition: all 0.2s;
  user-select: none;
  width: 100%;
}

.lang-selector-trigger:hover {
  background: var(--bg-surface-hover, rgba(0, 0, 0, 0.05));
  border-color: var(--text-muted);
}

.lang-selector-trigger:focus-visible {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.dropdown-arrow {
  font-size: 0.8rem;
  color: var(--text-muted);
  transition: transform 0.2s ease;
  margin-left: auto;
}

.arrow-open {
  transform: rotate(180deg);
}

.lang-selector-dropdown {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  width: 100%;
  background-color: var(--bg-body);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow:
    0 4px 12px -2px rgba(0, 0, 0, 0.08),
    0 2px 6px -1px rgba(0, 0, 0, 0.04);
  padding: 0.35rem 0;
  list-style: none;
  z-index: 2000;
  margin: 0;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  color: var(--text-main);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s;
  text-align: left;
}

.lang-option:hover,
.lang-option:focus-visible {
  background-color: var(--bg-surface-hover, rgba(0, 0, 0, 0.05));
}

.option-selected {
  background-color: var(--accent-color);
  color: var(--bg-body);
  font-weight: 600;
}

.option-selected:hover,
.option-selected:focus-visible {
  background-color: var(--accent-color);
  color: var(--bg-body);
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-0.25rem);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active,
  .dropdown-arrow {
    transition: none;
  }
}
</style>
