<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue';
  import { useRoute } from 'vue-router';

  import router from '@/router';
  import { useAuth } from '@/stores/auth';

  import BackdropModal from './BackdropModal.vue';

  const { signout } = useAuth();
  const route = useRoute();

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
  const handleClose = async (isLogout = false) => {
    if (isLogout) {
      await signout();

      if (route.meta.requiresAuth) {
        router.push({ name: 'home' });
      }
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

          <footer class="dialog__panel--actions mt-6">
            <button
              class="btn border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
              @click="handleClose(true)"
            >
              Log out
            </button>
            <button
              class="btn border-success text-success hover:bg-success hover:text-inherit focus:bg-success focus:text-inherit"
              @click="handleClose()"
            >
              Close
            </button>
          </footer>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
