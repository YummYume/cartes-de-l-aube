import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  /**
   *
   */
  function increment() {
    count.value += 1;
  }

  return { count, doubleCount, increment };
});
