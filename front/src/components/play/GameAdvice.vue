<script setup>
  defineProps({
    advice: {
      type: String,
      required: true,
    },
  });
</script>

<template>
  <div class="rounded-lg border-2 border-secondary bg-secondary/50 p-4" v-bind="$attrs">
    <p>{{ advice }}</p>
  </div>
</template>
