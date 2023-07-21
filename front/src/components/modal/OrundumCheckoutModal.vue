<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue';
  import { whenever } from '@vueuse/core';
  import { computed, ref } from 'vue';
  import { toast } from 'vue3-toastify';

  import { requestStorePayment, completeStorePayment } from '@/api/store';
  import IconSpinner from '@/components/icon/IconSpinner.vue';
  import { getStripe } from '@/stripe';

  import BackdropModal from './BackdropModal.vue';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    /**
     * @type {import('vue').PropType<StoreItem>}
     */
    storeItem: {
      required: true,
      default: null,
      validator: (val) => val === null || typeof val === 'object',
    },
  });
  const emit = defineEmits(['close', 'complete']);

  /**
   * @type {import('vue').Ref<HTMLDivElement>}
   */
  const card = ref(null);
  const isLoading = ref(true);
  const isSubmitting = ref(false);
  let abortController = new AbortController();
  /**
   * @type {import('@stripe/stripe-js').StripeElements|null} elements
   */
  let elements = null;
  /**
   * @type {string|null} paymentId
   */
  let paymentId = null;
  /**
   * @type {string|null} clientSecret
   */
  let clientSecret = null;

  const formattedAmount = computed(
    () =>
      props.storeItem?.amount.toLocaleString(window.navigator.language ?? 'en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) ?? '0'
  );
  const formattedPrice = computed(() =>
    Intl.NumberFormat(window.navigator.language ?? 'en', {
      style: 'currency',
      currency: 'EUR',
    }).format(props.storeItem?.price ?? 0)
  );
  const pullCount = computed(
    () =>
      props.storeItem?.pulls.toLocaleString(window.navigator.language ?? 'en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) ?? '0'
  );

  const resetFields = () => {
    elements = null;
    clientSecret = null;
  };

  const onStripeElementsReady = () => {
    isLoading.value = false;

    if (elements) {
      elements.getElement('payment').focus();
    }
  };

  const unloadElements = () => {
    abortController.abort();

    if (elements) {
      const payment = elements.getElement('payment');

      payment.off('ready', onStripeElementsReady);
      payment.unmount();
    }

    resetFields();
  };

  const handleClose = () => {
    if (isSubmitting.value) {
      return;
    }

    unloadElements();

    emit('close', paymentId);

    paymentId = null;
  };

  const handleSubmit = async () => {
    if (isLoading.value || isSubmitting.value || !elements) {
      return;
    }

    const defaultToastOptions = {
      isLoading: false,
      autoClose: 7500,
      closeButton: true,
      closeOnClick: true,
    };
    let toastId = null;

    try {
      isSubmitting.value = true;

      const { error } = await elements.submit();

      if (error) {
        toast.error(error.message);
      } else {
        toastId = toast.loading('Finalizing your payment, this should only take a moment...');

        const { paymentIntent, error: confirmError } = await getStripe().confirmPayment({
          elements,
          clientSecret,
          redirect: 'if_required',
        });

        if (confirmError) {
          toast.update(toastId, {
            type: 'error',
            render: confirmError.message,
            ...defaultToastOptions,
          });
        } else if (paymentIntent.status !== 'succeeded') {
          toast.update(toastId, {
            type: 'error',
            render: 'Sorry, your payment could not be processed. Please try again later.',
            ...defaultToastOptions,
          });
        } else {
          const { orundum } = await completeStorePayment(paymentId, abortController.signal);

          toast.update(toastId, {
            type: 'success',
            render: 'Your payment was successful! Thank you for your support.',
            ...defaultToastOptions,
          });

          unloadElements();

          emit('complete', orundum);

          paymentId = null;
        }
      }

      isSubmitting.value = false;
    } catch (err) {
      const message =
        'Sorry, something went wrong while processing your payment. Please try again later or contact support.';

      if (toastId) {
        toast.update(toastId, {
          type: 'error',
          render: message,
          ...defaultToastOptions,
        });
      } else {
        toast.error(message);
      }

      isSubmitting.value = false;
    }
  };

  whenever(
    () => props.isOpen && props.storeItem && card.value,
    async () => {
      try {
        abortController = new AbortController();
        isLoading.value = true;

        const data = await requestStorePayment(props.storeItem.orderTypeId, abortController.signal);

        paymentId = data.id;
        clientSecret = data.clientSecret;
        elements = getStripe().elements({
          clientSecret,
          appearance: {
            theme: 'night',
          },
        });
        const cardElement = elements.create('payment');

        cardElement.mount(card.value);
        cardElement.on('ready', onStripeElementsReady);
      } catch (err) {
        if (props.isOpen && props.storeItem && card.value) {
          toast.error(
            'Sorry, something went wrong while loading the payment form. Please try again later or contact support.'
          );
        }

        isLoading.value = false;

        handleClose();
      }
    }
  );
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
          <DialogTitle class="dialog__panel--title">Buy orundum</DialogTitle>
          <DialogDescription class="dialog__panel--description mt-2 max-w-[19rem]">
            Buy <strong>{{ formattedAmount }}</strong> orundum for
            <strong>{{ formattedPrice }}</strong
            >, granting you <strong>{{ pullCount }}</strong>
            {{ props.storeItem?.pulls === 1 ? 'pull' : 'pulls' }}.
            <span v-show="props.storeItem?.savedPercentage >= 1">
              This pack includes <strong>{{ props.storeItem.savedPercentage }}%</strong> bonus
              orundum.
            </span>
          </DialogDescription>

          <section class="dialog__panel--section my-6" :aria-busy="isLoading">
            <div
              class="flex min-h-[14rem] max-w-[19rem] flex-col items-center justify-center"
              ref="card"
            >
              <IconSpinner
                v-if="isLoading"
                aria-hidden="true"
                class="h-12 w-12 fill-slate-200 text-gray-500"
              />
            </div>
          </section>

          <footer class="dialog__panel--actions">
            <button
              class="btn border-success text-success hover:[&:not(:disabled)]:bg-success hover:[&:not(:disabled)]:text-inherit focus:[&:not(:disabled)]:bg-success focus:[&:not(:disabled)]:text-inherit"
              type="button"
              :disabled="isSubmitting || isLoading"
              @click="handleSubmit"
            >
              Pay
              <IconSpinner v-show="isSubmitting" />
            </button>
            <button
              class="btn border-accent text-accent hover:[&:not(:disabled)]:bg-accent hover:[&:not(:disabled)]:text-inherit focus:[&:not(:disabled)]:bg-accent focus:[&:not(:disabled)]:text-inherit"
              :disabled="isSubmitting"
              @click="handleClose"
            >
              Cancel
            </button>
          </footer>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
