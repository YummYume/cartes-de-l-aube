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
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
  });

  defineEmits(['confirm', 'cancel']);
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="$emit('cancel')" class="dialog">
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
        <DialogPanel class="dialog__panel max-w-[90vw] bg-slate-700 text-slate-100 lg:max-w-[60vw]">
          <DialogTitle class="dialog__panel--title">{{ title }}</DialogTitle>
          <DialogDescription class="dialog__panel--description mt-2">
            {{ message }}
          </DialogDescription>

          <footer class="dialog__panel--actions mt-6">
            <button
              class="btn border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
              @click="$emit('confirm')"
            >
              {{ confirmText }}
            </button>
            <button
              class="btn border-success text-success hover:bg-success hover:text-inherit focus:bg-success focus:text-inherit"
              @click="$emit('cancel')"
            >
              {{ cancelText }}
            </button>
          </footer>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
