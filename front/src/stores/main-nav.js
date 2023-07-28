import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMainNav = defineStore('main-nav', () => {
  /**
   * @type {import('vue').Ref<HTMLElement | null>}
   */
  const mainNavRef = ref(null);

  /**
   * @param {HTMLElement | null} newRef
   */
  const setMainNavRef = (newRef) => {
    mainNavRef.value = newRef;
  };

  const focusMainNav = () => {
    const toFocus = mainNavRef.value.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (toFocus) {
      toFocus.focus();
    }
  };

  return { mainNavRef, setMainNavRef, focusMainNav };
});
