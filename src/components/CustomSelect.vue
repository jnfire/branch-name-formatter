<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    id?: string;
    name?: string;
    size?: 'md' | 'sm';
    disabled?: boolean;
  }>(),
  {
    placeholder: undefined,
    id: undefined,
    name: undefined,
    size: 'md',
    disabled: false,
  },
);

const emit = defineEmits<{
  (emitEvent: 'update:modelValue', value: string): void;
}>();

const { t } = useI18n();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const optionRefs = ref<HTMLButtonElement[]>([]);

const currentLabel = computed(() => {
  const matchingOption = props.options.find((optionItem) => optionItem.value === props.modelValue);
  return matchingOption ? matchingOption.label : props.placeholder || t('shared.select_option');
});

const setOptionRef = (element: unknown, index: number) => {
  if (element) optionRefs.value[index] = element as HTMLButtonElement;
};

const openDropdown = async () => {
  isOpen.value = true;
  await nextTick();
  const selectedIndex = props.options.findIndex(
    (optionItem) => optionItem.value === props.modelValue,
  );
  optionRefs.value[selectedIndex >= 0 ? selectedIndex : 0]?.focus();
};

const closeDropdown = (returnFocus = true) => {
  isOpen.value = false;
  if (returnFocus) triggerRef.value?.focus();
};

const toggleDropdown = () => {
  if (props.disabled) return;
  if (isOpen.value) {
    closeDropdown(false);
  } else {
    openDropdown();
  }
};

const selectOption = (value: string) => {
  emit('update:modelValue', value);
  closeDropdown();
};

const focusOptionByOffset = (currentIndex: number, offset: number) => {
  const count = props.options.length;
  if (count === 0) return;
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
  if (props.disabled) return;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    openDropdown();
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    closeDropdown(false);
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
  <div :id="id ? `${id}-container` : undefined" ref="containerRef" class="custom-select-container">
    <!-- input oculto para compatibilidad con forms -->
    <input type="hidden" :name="name" :value="modelValue" />

    <button
      :id="id"
      ref="triggerRef"
      type="button"
      class="custom-select-trigger"
      :class="{ 'custom-select-trigger--sm': size === 'sm' }"
      :disabled="disabled"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggleDropdown"
      @keydown="handleTriggerKeydown"
    >
      <span class="select-label" :class="{ placeholder: !modelValue && placeholder }">{{
        currentLabel
      }}</span>
      <span class="dropdown-arrow" :class="{ 'arrow-open': isOpen }" aria-hidden="true">▾</span>
    </button>

    <transition name="fade-slide">
      <ul v-if="isOpen" class="custom-select-dropdown" role="listbox">
        <li v-for="(optionItem, index) in options" :key="optionItem.value" role="presentation">
          <button
            :ref="(element) => setOptionRef(element, index)"
            type="button"
            class="select-option"
            :class="{ 'option-selected': optionItem.value === modelValue }"
            role="option"
            :aria-selected="optionItem.value === modelValue"
            :tabindex="optionItem.value === modelValue ? 0 : -1"
            @click="selectOption(optionItem.value)"
            @keydown="handleOptionKeydown($event, index)"
          >
            <span>{{ optionItem.label }}</span>
          </button>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.custom-select-container {
  position: relative;
  display: block;
  width: 100%;
}

.custom-select-trigger {
  width: 100%;
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
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease-in-out;
  text-align: left;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.custom-select-trigger--sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
}

.custom-select-trigger:focus,
.custom-select-trigger:focus-visible {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.custom-select-trigger:hover {
  border-color: var(--text-muted);
}

.custom-select-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.custom-select-trigger:disabled:hover {
  border-color: var(--border-color);
}

.placeholder {
  color: var(--text-muted);
}

.select-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}

.dropdown-arrow {
  font-size: 0.8rem;
  color: var(--text-muted);
  transition: transform 0.2s ease;
  margin-left: 0.5rem;
}

.arrow-open {
  transform: rotate(180deg);
}

.custom-select-dropdown {
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
  max-height: 250px;
  overflow-y: auto;
  list-style: none;
  z-index: 2000;
  margin: 0;
}

.select-option {
  display: flex;
  align-items: center;
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

.select-option:hover,
.select-option:focus-visible {
  background-color: var(--bg-surface-hover, rgba(0, 0, 0, 0.05));
  outline: none;
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
