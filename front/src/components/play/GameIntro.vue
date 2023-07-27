<script setup>
  import GameDisclosure from '@/components/disclosure/GameDisclosure.vue';

  import IconSpinner from '../icon/IconSpinner.vue';

  defineProps({
    isSubmitting: {
      type: Boolean,
      default: false,
    },
    hasEmptySquad: {
      type: Boolean,
      default: false,
    },
  });

  defineEmits(['search']);
</script>

<template>
  <div class="contents">
    <h1 class="w-full text-center text-4xl">Play</h1>
    <section class="w-[62rem] max-w-full">
      <h2 class="mb-12 text-2xl">Ready to play? Click the button below to search for a game.</h2>
      <div class="flex flex-col items-center justify-center gap-2">
        <button
          :disabled="isSubmitting || hasEmptySquad"
          :aria-busy="isSubmitting"
          class="btn focus:not(:disabled)]:scale-105 w-52 rounded-md border-secondary bg-secondary text-white shadow-sm shadow-secondary hover:[&:not(:disabled)]:scale-105 hover:[&:not(:disabled)]:shadow-lg hover:[&:not(:disabled)]:shadow-secondary focus:[&:not(:disabled)]:shadow-lg focus:[&:not(:disabled)]:shadow-secondary/75"
          type="button"
          @click="$emit('search')"
        >
          <span>Search a match</span>
          <IconSpinner v-show="isSubmitting" />
        </button>
        <p v-if="hasEmptySquad" class="text-lg font-semibold">
          You need to have at least 1 operator in your squad to play. You can edit your squad
          <RouterLink class="link text-accent" to="/squad">here</RouterLink>.
        </p>
      </div>
    </section>
    <section class="w-[62rem] max-w-full">
      <h2 class="mb-6 text-2xl">Game FAQ</h2>
      <GameDisclosure />
    </section>
  </div>
</template>
