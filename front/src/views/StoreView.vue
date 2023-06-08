<script setup>
  import OrundumStore from '@/components/store/OrundumStore.vue';
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
</template>
