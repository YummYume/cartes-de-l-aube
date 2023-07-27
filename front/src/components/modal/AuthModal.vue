<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue';
  import { ref } from 'vue';
  import { toast } from 'vue3-toastify';

  import BackdropModal from './BackdropModal.vue';

  import AuthForm from '../form/AuthForm.vue';
  import IconSpinner from '../icon/IconSpinner.vue';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    isLogin: {
      type: Boolean,
      required: true,
    },
  });

  const stateForm = ref('done');

  const emit = defineEmits(['close']);

  const handleClose = () => {
    if (stateForm.value === 'done' || stateForm.value === 'fail') {
      if (stateForm.value === 'done') {
        toast.success(
          props.isLogin
            ? 'Logged in successfully!'
            : 'Registered successfully! You are now logged in.'
        );
      }

      emit('close');
    }
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
          class="dialog__panel w-[31.25rem] max-w-[90vw] bg-slate-700 text-slate-100 lg:max-w-[60vw]"
        >
          <DialogTitle class="dialog__panel--title">
            {{ isLogin ? 'Login' : 'Register' }}
          </DialogTitle>
          <DialogDescription class="dialog__panel--description sr-only">
            {{ isLogin ? 'Login to your account' : 'Register a new account' }}
          </DialogDescription>

          <section class="dialog__panel--section mt-6">
            <AuthForm
              :isLogin="isLogin"
              @on-async-submit="
                (value) => {
                  stateForm = value;

                  if (value === 'done') {
                    emit('close');
                  }
                }
              "
              v-slot="{ isSubmitting, meta }"
            >
              <footer class="dialog__panel--actions mt-6">
                <button
                  class="btn border-success text-success hover:[&:not(:disabled)]:bg-success hover:[&:not(:disabled)]:text-inherit focus:[&:not(:disabled)]:bg-success focus:[&:not(:disabled)]:text-inherit"
                  type="submit"
                  :disabled="isSubmitting || !meta.valid"
                >
                  {{ isLogin ? 'Log in' : 'Register' }}
                  <IconSpinner v-show="isSubmitting" />
                </button>
                <button
                  class="btn border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
                  type="button"
                  :disabled="isSubmitting"
                  @click="handleClose"
                >
                  Close
                </button>
              </footer>
            </AuthForm>
          </section>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
