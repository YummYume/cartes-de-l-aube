<script setup>
  import { useHead } from '@unhead/vue';
  import { defineAsyncComponent, ref } from 'vue';

  import { cancelStorePayment } from '@/api/store';
  import StoreDisclosure from '@/components/disclosure/StoreDisclosure.vue';
  import OrundumStore from '@/components/store/OrundumStore.vue';
  import { useAuth } from '@/stores/auth';

  const OrundumCheckoutModal = defineAsyncComponent(() =>
    import('@/components/modal/OrundumCheckoutModal.vue')
  );

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

  useHead({
    title: 'Store',
    meta: [
      {
        name: 'description',
        content:
          'In need of Orundum? Buy some here! You will support the game and get some Orundum in return.',
      },
    ],
  });
</script>

<template>
  <h1 class="w-full text-center text-4xl">Store</h1>
  <section class="w-[62rem] max-w-full">
    <h2 class="mb-6 text-2xl">Buy Orundum here using real money. Come on, you know you want to.</h2>
    <OrundumStore :items="items" @buy="(item) => handleOpen(item)" />
  </section>
  <section class="w-[62rem] max-w-full">
    <h2 class="mb-6 text-2xl">Store FAQ</h2>
    <StoreDisclosure />
  </section>

  <OrundumCheckoutModal
    :isOpen="orundumCheckoutModalOpen"
    :storeItem="currentStoreItem"
    @close="handleClose"
    @complete="handleComplete"
  />
</template>
