<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue';

  import BackdropModal from './BackdropModal.vue';

  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
  });

  defineEmits(['close']);
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
        <DialogPanel
          class="dialog__panel max-w-[95vw] bg-slate-700 text-slate-100 sm:max-w-xl lg:max-w-[60vw]"
        >
          <DialogTitle class="dialog__panel--title">Leaderboard</DialogTitle>
          <DialogDescription class="dialog__panel--description mt-2">
            Who is the best player in the world? Find out here!
          </DialogDescription>

          <section class="dialog__panel--section my-6">
            <span>TODO</span>
          </section>

          <footer class="dialog__panel--actions mt-6">
            <button
              class="btn border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
              @click="$emit('close')"
            >
              Close
            </button>
          </footer>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>