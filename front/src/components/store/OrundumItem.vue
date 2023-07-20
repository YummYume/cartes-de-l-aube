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
    savedPercentage: {
      default: null,
      required: false,
      validator: (val) => val === null || typeof val === 'number',
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
  <div
    class="relative m-auto flex h-48 w-40 flex-col items-center justify-center space-y-2 rounded-xl border-2 border-accent shadow-md transition-all hover:scale-105 focus-visible:scale-105"
    :aria-label="`Buy ${formattedAmount} orundum for ${formattedPrice}${
      savedPercentage ? `, including ${savedPercentage}% bonus orundum` : ''
    }.`"
    role="button"
    v-bind="$attrs"
  >
    <span
      v-show="savedPercentage >= 1"
      class="absolute right-4 top-4 -translate-y-1/2 translate-x-1/2 rotate-12 rounded-md bg-secondary p-0.5 shadow-md"
      >+{{ savedPercentage }}%</span
    >
    <div
      aria-hidden="true"
      class="flex flex-grow flex-row items-center justify-center gap-1 p-4 text-2xl font-medium"
    >
      <IconOrundum class="h-10 w-10" />
      <span>{{ formattedAmount }}</span>
    </div>
    <span
      aria-hidden="true"
      class="w-full rounded-b-lg bg-accent px-2 py-3 text-center text-xl font-semibold"
      >{{ formattedPrice }}</span
    >
  </div>
</template>
