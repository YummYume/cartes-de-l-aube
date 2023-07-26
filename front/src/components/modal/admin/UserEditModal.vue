<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import { Form } from 'vee-validate';

  import InputField from '@/components/form/InputField.vue';
  import IconSpinner from '@/components/icon/IconSpinner.vue';
  import { userValidation } from '@/utils/validation/admin/user-validation';

  import BackdropModal from '../BackdropModal.vue';

  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
    /**
     * @type {User}
     */
    user: {
      type: Object,
      required: true,
    },
  });

  defineEmits(['close', 'save']);
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
          class="dialog__panel w-[31.25rem] max-w-[80vw] bg-slate-700 text-slate-100 lg:max-w-[60vw]"
        >
          <DialogTitle class="dialog__panel--title"> Edit User {{ user.username }} </DialogTitle>
          <DialogDescription class="dialog__panel--description sr-only">
            You can edit {{ user.username }}'s details here. Click save to save the changes.
          </DialogDescription>

          <section class="dialog__panel--section mt-6">
            <Form
              @submit="$emit('save', $event)"
              :validation-schema="toTypedSchema(userValidation)"
              v-slot="{ isSubmitting, meta }"
              class="flex flex-col gap-5"
            >
              <InputField
                id="password"
                name="password"
                label="Password"
                type="password"
                placeholder="Enter the password"
                autocomplete="off"
                data-lpignore="true"
                data-form-type="other"
              />
              <InputField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm password"
                type="password"
                placeholder="Confirm the password"
                autocomplete="off"
                data-lpignore="true"
                data-form-type="other"
              />
              <InputField
                id="role"
                name="role"
                label="Role"
                :initial-value="user.role"
                :options="[
                  { label: 'User', value: 'user' },
                  { label: 'Admin', value: 'admin' },
                ]"
              />
              <div class="flex justify-end gap-2">
                <button
                  class="btn border-success text-success hover:[&:not(:disabled)]:bg-success hover:[&:not(:disabled)]:text-inherit focus:[&:not(:disabled)]:bg-success focus:[&:not(:disabled)]:text-inherit"
                  type="submit"
                  :disabled="isSubmitting || !meta.valid"
                >
                  Edit
                  <IconSpinner v-show="isSubmitting" />
                </button>
                <button
                  class="btn border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
                  type="button"
                  :disabled="isSubmitting"
                  @click="$emit('close')"
                >
                  Close
                </button>
              </div>
            </Form>
          </section>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
