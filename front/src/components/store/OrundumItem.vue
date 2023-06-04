<script setup>
  import { computed } from 'vue';

  import IconOrundum from '../icon/IconOrundum.vue';

  const props = defineProps({
    price: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  });

  const formattedAmount = computed(() =>
    props.amount.toLocaleString(window.navigator.language ?? 'en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
  const formattedPrice = computed(() =>
    Intl.NumberFormat(window.navigator.language ?? 'en', {
      style: 'currency',
      currency: 'EUR',
    }).format(props.price)
  );
</script>

<template>
  <button
    class="m-auto flex h-48 w-40 flex-col items-center justify-center space-y-2 overflow-hidden rounded-xl border-2 border-accent shadow-md transition-all hover:scale-105 focus-visible:scale-105"
    :aria-label="`Buy ${formattedAmount} orundum for ${formattedPrice}`"
  >
    <div class="flex flex-grow flex-row items-center justify-center gap-1 p-4 text-2xl font-medium">
      <IconOrundum class="h-10 w-10" />
      <span>{{ formattedAmount }}</span>
    </div>
    <span class="w-full bg-accent px-2 py-3 text-center text-xl font-semibold">{{
      formattedPrice
    }}</span>
  </button>
</template>
