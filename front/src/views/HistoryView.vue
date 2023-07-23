<script setup>
  import { useHead } from '@unhead/vue';

  defineProps({
    /**
     * @type {import('vue').PropType<MatchHistory[]>}
     */
    matchHistories: {
      type: Array,
      required: true,
    },
  });

  useHead({
    title: 'History',
    meta: [
      {
        name: 'description',
        content: 'Your game history available here. Are you more of a winner or a loser?',
      },
    ],
  });
</script>

<template>
  <h1 class="w-full text-center text-4xl">Your game history</h1>
</template>
