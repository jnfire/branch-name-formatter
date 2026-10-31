import { watch, onBeforeUnmount, type Ref } from 'vue';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Traps Tab/Shift+Tab focus within containerRef while isOpen is true, closes on
// Escape, and restores focus to whatever was focused before the dialog opened.
export function useFocusTrap(
  containerRef: Ref<HTMLElement | null>,
  isOpen: Ref<boolean>,
  onClose: () => void,
) {
  let previouslyFocused: HTMLElement | null = null;

  const getFocusable = (): HTMLElement[] => {
    if (!containerRef.value) return [];
    return Array.from(containerRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = getFocusable();
    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  };

  watch(
    isOpen,
    (openState: boolean) => {
      if (openState) {
        previouslyFocused = document.activeElement as HTMLElement | null;
        requestAnimationFrame(() => {
          const focusableElements = getFocusable();
          (focusableElements[0] ?? containerRef.value)?.focus();
        });
        document.addEventListener('keydown', handleKeydown, true);
      } else {
        document.removeEventListener('keydown', handleKeydown, true);
        previouslyFocused?.focus();
        previouslyFocused = null;
      }
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown, true);
  });
}
