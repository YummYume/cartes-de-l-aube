<script setup>
  import OrundumStore from '@/components/store/OrundumStore.vue';
  import { useMoneyModal } from '@/stores/money-modal';

  const moneyModalStore = useMoneyModal();
</script>

<template>
  <main class="container m-auto flex h-full flex-col items-center gap-10 p-5">
    <h1 class="w-full text-center text-4xl">Store</h1>
    <section class="w-[62rem] max-w-full">
      <h2 class="mb-6 text-2xl">
        Buy Orundum here using real money. Come on, you know you want to.
      </h2>
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
