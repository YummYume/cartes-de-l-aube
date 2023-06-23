<script setup>
  defineProps({
    /**
     * @type {import('vue').PropType<MatchHistory[]>}
     */
    matchHistories: {
      type: Array,
      required: true,
    },
  });
</script>

<template>
  <main class="container m-auto flex h-full flex-col items-center gap-10 p-5">
    <h1>History</h1>
  </main>
</template>
