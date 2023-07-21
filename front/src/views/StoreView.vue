<script setup>
  import { ref } from 'vue';

  import { cancelStorePayment } from '@/api/store';
  import StoreDisclosure from '@/components/disclosure/StoreDisclosure.vue';
  import OrundumCheckoutModal from '@/components/modal/OrundumCheckoutModal.vue';
  import OrundumStore from '@/components/store/OrundumStore.vue';
  import { useAuth } from '@/stores/auth';
  import { useMoneyModal } from '@/stores/money-modal';

  defineProps({
    /**
     * @type {import('vue').PropType<StoreItem[]>}
     */
    items: {
      type: Array,
      required: true,
    },
  });

  const { auth } = useAuth();
  const moneyModalStore = useMoneyModal();
  const orundumCheckoutModalOpen = ref(false);
  /**
   * @type {import('vue').Ref<StoreItem|null>}
   */
  const currentStoreItem = ref(null);

  /**
   * @param {StoreItem} storeItem
   */
  const handleOpen = (storeItem) => {
    currentStoreItem.value = storeItem;
    orundumCheckoutModalOpen.value = true;
  };

  /**
   * @param {string|null} paymentId
   */
  const handleClose = (paymentId) => {
    orundumCheckoutModalOpen.value = false;

    if (paymentId) {
      try {
        cancelStorePayment(paymentId);
      } catch (err) {
        // We don't care if an error occurs here. The payment will never be processed anyway.
      }
    }
  };

  const handleComplete = (orundum) => {
    auth.orundum = orundum;
    orundumCheckoutModalOpen.value = false;
  };
</script>

<template>
  <main class="container m-auto flex h-full flex-col items-center gap-10 p-5">
    <h1 class="w-full text-center text-4xl">Store</h1>
    <section class="w-[62rem] max-w-full">
      <h2 class="mb-6 text-2xl">
        Buy Orundum here using real money. Come on, you know you want to.
      </h2>
      <OrundumStore :items="items" @buy="(item) => handleOpen(item)" />
    </section>
    <section class="w-[62rem] max-w-full">
      <h2 class="mb-6 text-2xl">Store FAQ</h2>
      <StoreDisclosure />
    </section>
  </main>
  <button
    type="button"
    class="absolute bottom-2 left-2 opacity-0 transition-all hover:opacity-100 focus-visible:opacity-100"
    aria-label="You found a secret! Press Shift + o + m to open it. Or just... You know, click this button."
    @click="moneyModalStore.openMoneyModal()"
  >
    <kbd class="kbd bg-secondary">Shift</kbd> + <kbd class="kbd bg-secondary">o</kbd> +
    <kbd class="kbd bg-secondary">m</kbd>
  </button>
  <OrundumCheckoutModal
    :isOpen="orundumCheckoutModalOpen"
    :storeItem="currentStoreItem"
    @close="handleClose"
    @complete="handleComplete"
  />
</template>
