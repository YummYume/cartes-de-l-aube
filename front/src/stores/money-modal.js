import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMoneyModal = defineStore('money-modal', () => {
  const moneyModalOpened = ref(false);
  const openMoneyModal = () => {
    moneyModalOpened.value = true;
  };
  const closeMoneyModal = () => {
    moneyModalOpened.value = false;
  };

  return { moneyModalOpened, openMoneyModal, closeMoneyModal };
});
