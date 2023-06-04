<script setup>
  import OrundumItem from './OrundumItem.vue';

  /**
   * @type {{ price: number, amount: number }} items
   */
  const items = [
    { price: 0.01, amount: 60 },
    { price: 0.05, amount: 350 },
    { price: 0.1, amount: 800 },
    { price: 0.2, amount: 1700 },
    { price: 0.5, amount: 4500 },
    { price: 1, amount: 10000 },
    { price: 2.5, amount: 25000 },
    { price: 5, amount: 55000 },
    { price: 10, amount: 120000 },
  ];
</script>

<template>
  <div class="flex w-full flex-grow flex-col items-center justify-center space-y-8">
    <div class="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <OrundumItem
        v-for="(item, key) in items"
        :key="key"
        :price="item.price"
        :amount="item.amount"
      />
    </div>
  </div>
</template>
