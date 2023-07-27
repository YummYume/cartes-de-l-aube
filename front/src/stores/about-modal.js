import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAboutModal = defineStore('about-modal', () => {
  const aboutModalOpened = ref(false);
  const openAboutModal = () => {
    aboutModalOpened.value = true;
  };
  const closeAboutModal = () => {
    aboutModalOpened.value = false;
  };

  return { aboutModalOpened, openAboutModal, closeAboutModal };
});
