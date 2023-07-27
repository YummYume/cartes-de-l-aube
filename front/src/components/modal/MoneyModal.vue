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
  import { toast } from 'vue3-toastify';

  import { useAuth } from '@/stores/auth';
  import api from '@/utils/api';
  import { moneyValidation } from '@/utils/validation/money-validation';

  import BackdropModal from './BackdropModal.vue';

  import InputField from '../form/InputField.vue';
  import IconSpinner from '../icon/IconSpinner.vue';

  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits(['close']);
  const { auth } = useAuth();

  const handleClose = () => {
    emit('close');
  };

  /**
   * @param {{ count: number }} values
   */
  const onSubmit = async (values) => {
    try {
      const res = await api.post('money', values);

      auth.orundum = res.orundum;

      toast.success(
        `${
          values.count >= 100000 ? 'A LOT of money has been printed!' : 'Money has been printed!'
        } You won't abuse this, right?`
      );
    } catch (err) {
      toast.error("Something went wrong while printing money. Hey, don't tell anyone about this!");
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
        <DialogPanel class="dialog__panel max-w-[90vw] bg-slate-700 text-slate-100 lg:max-w-[60vw]">
          <DialogTitle class="dialog__panel--title">Money money money... Who are you?</DialogTitle>
          <DialogDescription class="dialog__panel--description mt-2">
            Money is the root of all evil... Well, it doesn't matter now. You somehow found this
            place to get as much of it as you want. Just don't ask where it comes from.
          </DialogDescription>

          <Form
            @submit="onSubmit"
            :validation-schema="toTypedSchema(moneyValidation)"
            v-slot="{ isSubmitting, meta, values }"
            class="flex flex-col gap-5"
          >
            <section class="dialog__panel--section my-6">
              <InputField
                id="count"
                name="count"
                label="Orundum amount"
                type="number"
                placeholder="How much?"
                v-model.number="values.count"
                :initial-value="99999"
                :is-required="true"
              />
            </section>

            <footer class="dialog__panel--actions">
              <button
                class="btn border-success text-success hover:[&:not(:disabled)]:bg-success hover:[&:not(:disabled)]:text-inherit focus:[&:not(:disabled)]:bg-success focus:[&:not(:disabled)]:text-inherit"
                type="submit"
                :disabled="isSubmitting || !meta.valid"
              >
                Give me money
                <IconSpinner v-show="isSubmitting" />
              </button>
              <button
                class="btn border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
                @click="handleClose"
                type="button"
              >
                I'm done printing money
              </button>
            </footer>
          </Form>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
