<script setup>
  import { TransitionChild } from '@headlessui/vue';
  import { computed } from 'vue';

  const props = defineProps({
    backgroundClass: {
      type: String,
      default: 'bg-black/75',
    },
  });

  const classes = computed(() => ['fixed inset-0', props.backgroundClass]);
</script>

<template>
  <TransitionChild
    enter="duration-300 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="duration-200 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0"
    as="template"
  >
    <div :class="classes" aria-hidden="true" />
  </TransitionChild>
</template>
