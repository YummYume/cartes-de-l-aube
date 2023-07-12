<script setup>
  import OrundumStore from '@/components/store/OrundumStore.vue';
  import { useMoneyModal } from '@/stores/money-modal';

  const moneyModalStore = useMoneyModal();
</script>

<template>
  <main
    class="container m-auto flex h-full flex-col items-center justify-around gap-5 py-5 xl:gap-2"
  >
    <h1 class="w-full text-center text-4xl">Store</h1>
    <p class="text-xl">Buy Orundum here using real money. Come on, you know you want to.</p>
    <section class="w-[62rem] max-w-full">
      <OrundumStore />
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
</template>
