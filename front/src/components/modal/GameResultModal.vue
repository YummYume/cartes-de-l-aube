<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue';
  import { computed } from 'vue';

  import BackdropModal from './BackdropModal.vue';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    /**
     * @type {import('vue').PropType<'win'|'lose'>}
     */
    result: {
      type: String,
      required: true,
      validator: (value) => ['win', 'lose'].includes(value),
    },
  });

  defineEmits(['close']);

  const isWinner = computed(() => props.result === 'win');
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="$emit('close')" class="dialog">
      <BackdropModal />
      <TransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
        as="template"
      >
        <DialogPanel class="z-50 max-w-[90vw] text-slate-100 lg:max-w-[60vw]">
          <DialogTitle
            :class="`dialog__panel--title animate-bounce text-center text-5xl ${
              isWinner ? 'text-success' : 'text-accent'
            }`"
          >
            {{ isWinner ? 'You won!' : 'You lost!' }}
          </DialogTitle>
          <DialogDescription class="dialog__panel--description mt-4 text-white">
            <p>{{ isWinner ? 'Congratulations!' : 'Better luck next time!' }}</p>
            <p>
              You earned {{ isWinner ? '300' : '50' }} orundum and
              {{ isWinner ? 'lost 20' : 'gained 20' }} leaderboard points.
            </p>
          </DialogDescription>

          <footer class="relative mt-8 text-center text-2xl">
            <button type="button" @click="$emit('close')">Click anywhere to close</button>
          </footer>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
