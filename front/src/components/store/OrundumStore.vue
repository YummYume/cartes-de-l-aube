<script setup>
  import OrundumItem from './OrundumItem.vue';

  defineProps({
    /**
     * @type {import('vue').PropType<StoreItem[]>}
     */
    items: {
      type: Array,
      required: true,
    },
  });
</script>

<template>
  <div class="flex w-full flex-grow flex-col items-center justify-center space-y-8">
    <div class="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <OrundumItem
        v-for="(item, key) in items"
        :key="key"
        :price="item.price"
        :amount="item.amount"
        :savedPercentage="item.savedPercentage"
        @click="$emit('buy', item)"
      />
    </div>
  </div>
</template>
