<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue';

  import { useAuth } from '@/stores/auth';

  import BackdropModal from './BackdropModal.vue';

  const { signout } = useAuth();

  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
  });
  const emit = defineEmits(['close']);

  /**
   * @param {boolean} isLogout
   */
  const handleClose = (isLogout = false) => {
    if (isLogout) {
      signout();
    }

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
          <DialogTitle class="dialog__panel--title">Log out</DialogTitle>
          <DialogDescription class="dialog__panel--description mt-2">
            Are you sure you want to logout?
          </DialogDescription>

          <section class="dialog__panel--section my-6"></section>

          <footer class="dialog__panel--actions flex flex-row justify-end">
            <button
              class="btn mr-2 border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
              @click="handleClose(true)"
            >
              log out
            </button>
            <button
              class="btn border-success text-success hover:bg-success hover:text-inherit focus:bg-success focus:text-inherit"
              @click="handleClose()"
            >
              close
            </button>
          </footer>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
