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

  import OrundumStore from '../store/OrundumStore.vue';

  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
  });
  const emit = defineEmits(['close']);

  const handleClose = () => {
    emit('close');
  };
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="handleClose" class="dialog">
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
        <DialogPanel class="dialog__panel max-w-[80vw] bg-slate-700 text-slate-100 lg:max-w-[60vw]">
          <DialogTitle class="dialog__panel--title">Store</DialogTitle>
          <DialogDescription class="dialog__panel--description mt-2">
            Buy Orundum directly from the store. Hey, it's not like you can get it anywhere else.
          </DialogDescription>

          <section class="dialog__panel--section my-6">
            <OrundumStore />
          </section>

          <footer class="dialog__panel--actions">
            <button
              class="btn border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
              @click="handleClose"
            >
              I'm done shopping
            </button>
          </footer>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
