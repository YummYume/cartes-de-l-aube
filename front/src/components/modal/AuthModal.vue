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

  import AuthForm from '../form/AuthForm.vue';

  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    isLogin: {
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
        <DialogPanel
          class="dialog__panel min-w-[35vw] max-w-[80vw] bg-slate-700 text-slate-100 lg:min-w-[25vw] lg:max-w-[60vw]"
        >
          <DialogTitle class="dialog__panel--title">
            {{ isLogin ? 'Login' : 'Register' }}
          </DialogTitle>
          <DialogDescription class="dialog__panel--description mt-2"></DialogDescription>

          <section class="dialog__panel--section my-6">
            <AuthForm :isLogin="isLogin">
              <button
                class="btn border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
                type="button"
                @click="handleClose"
              >
                Close
              </button>
            </AuthForm>
          </section>

          <footer class="dialog__panel--actions"></footer>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
