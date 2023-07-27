<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
    TabGroup,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
  } from '@headlessui/vue';
  import { toTypedSchema } from '@vee-validate/zod';
  import { useMediaQuery } from '@vueuse/core';
  import { Form } from 'vee-validate';
  import { ref, watch } from 'vue';
  import { toast } from 'vue3-toastify';

  import { updateUser } from '@/api/auth/index';
  import { getMatchHistories } from '@/api/history';
  import { getPayments } from '@/api/store/history';
  import { useAuth } from '@/stores/auth';
  import { userValidation } from '@/utils/validation/admin/user-validation';

  import BackdropModal from './BackdropModal.vue';

  import InputField from '../form/InputField.vue';
  import IconSpinner from '../icon/IconSpinner.vue';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits(['close']);

  const { auth } = useAuth();
  const vertical = useMediaQuery('(max-width: 639px)');
  const paymentsLoading = ref(true);
  const matchHistoryLoading = ref(true);
  /**
   * @type {import('vue').Ref<Payment[]>}
   */
  const payments = ref([]);
  /**
   * @type {import('vue').Ref<MatchHistory[]>}
   */
  const matchHistories = ref([]);
  const isLoading = ref(false);
  const currentTab = ref(0);
  let paymentsAbortController = new AbortController();
  let matchHistoryAbortController = new AbortController();

  const handleSave = async (values, { resetField }) => {
    if (isLoading.value) {
      return;
    }

    isLoading.value = true;

    try {
      await updateUser({
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      resetField('password', '');
      resetField('confirmPassword', '');

      toast.success(`Account updated successfully!`);
    } catch (err) {
      if (err.status === 422) {
        toast.error(err.data.message);
      } else {
        toast.error('Failed to update account. Please try again later.');
      }
    }

    isLoading.value = false;
  };

  const handleClose = () => {
    if (isLoading.value) {
      return;
    }

    emit('close');
  };

  watch(
    () => props.isOpen,
    async (isOpen) => {
      if (isOpen) {
        try {
          paymentsLoading.value = true;

          paymentsAbortController.abort();
          paymentsAbortController = new AbortController();

          payments.value = (await getPayments()).payments;
        } catch (error) {
          if (error.name !== 'AbortError') {
            toast.error(
              'Sorry, something went wrong while getting your payments. Please try again later.'
            );

            emit('close');
          }
        } finally {
          paymentsLoading.value = false;
        }

        try {
          matchHistoryLoading.value = true;

          matchHistoryAbortController.abort();
          matchHistoryAbortController = new AbortController();

          matchHistories.value = (await getMatchHistories()).matches;
        } catch (error) {
          if (error.name !== 'AbortError') {
            toast.error(
              'Sorry, something went wrong while getting your match history. Please try again later.'
            );

            emit('close');
          }
        } finally {
          matchHistoryLoading.value = false;
        }
      } else {
        paymentsAbortController.abort();
        matchHistoryAbortController.abort();
      }
    }
  );
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="() => handleClose()" class="dialog">
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
          <DialogTitle class="dialog__panel--title">{{ auth.username }}</DialogTitle>
          <DialogDescription class="dialog__panel--description mt-2">
            Manage your account and check your payments and match history here.
          </DialogDescription>

          <section class="dialog__panel--section my-6">
            <TabGroup class="tab" as="div" :vertical="vertical" @change="currentTab = $event">
              <TabList class="tab__list">
                <Tab class="tab__list-item" :disabled="isLoading">Account</Tab>
                <Tab class="tab__list-item" :disabled="isLoading">Payments</Tab>
                <Tab class="tab__list-item" :disabled="isLoading">Match history</Tab>
              </TabList>
              <TabPanels>
                <TabPanel class="tab__panel-item">
                  <Form
                    @submit="handleSave"
                    :validation-schema="toTypedSchema(userValidation)"
                    id="account-form"
                    class="flex flex-col gap-5"
                  >
                    <InputField
                      id="password"
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Enter your new password"
                      autocomplete="new-password"
                      :is-required="false"
                    />
                    <InputField
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm password"
                      type="password"
                      placeholder="Confirm your new password"
                      autocomplete="new-password"
                      :is-required="false"
                    />
                  </Form>
                </TabPanel>
                <TabPanel
                  class="tab__panel-item max-h-[50vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary scrollbar-corner-transparent"
                  :aria-busy="paymentsLoading"
                >
                  <Transition
                    enter-active-class="transition-opacity duration-300"
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-active-class="transition-opacity duration-300"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                    mode="out-in"
                  >
                    <div v-if="paymentsLoading" class="flex flex-col gap-4">
                      <div
                        v-for="index in 3"
                        :key="index"
                        class="display-item h-[4.625rem] animate-pulse border border-secondary bg-secondary/10"
                      />
                    </div>
                    <div v-else-if="payments.length === 0" class="flex justify-center">
                      <span class="text-xl">No payments yet.</span>
                    </div>
                    <div v-else class="flex flex-col gap-4">
                      <div
                        v-for="payment in payments"
                        :key="payment.id"
                        class="display-item border border-secondary bg-secondary/10"
                        tabindex="0"
                        aria-label="Payment history"
                        :aria-describedby="`payment-history-${payment.id}`"
                      >
                        <div class="display-item__title-container" aria-hidden="true">
                          <span class="display-item__title">
                            {{
                              payment.amount.toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })
                            }}
                            Orundum
                          </span>
                          <span class="display-item__subtitle">
                            {{ new Date(payment.paidAt).toLocaleString() }}
                          </span>
                        </div>
                        <span class="display-item__info" aria-hidden="true">
                          {{
                            Intl.NumberFormat(undefined, {
                              style: 'currency',
                              currency: 'EUR',
                            }).format(payment.price)
                          }}
                        </span>
                        <p class="sr-only" :id="`payment-history-${payment.id}`">
                          Paid {{ payment.amount }} Orundum at
                          {{ new Date(payment.paidAt).toLocaleString() }} for
                          {{
                            Intl.NumberFormat(undefined, {
                              style: 'currency',
                              currency: 'EUR',
                            }).format(payment.price)
                          }}.
                        </p>
                      </div>
                    </div>
                  </Transition>
                </TabPanel>
                <TabPanel
                  class="tab__panel-item max-h-[50vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary scrollbar-corner-transparent"
                  :aria-busy="matchHistoryLoading"
                >
                  <div v-if="matchHistoryLoading" class="flex flex-col gap-4">
                    <div
                      v-for="index in 3"
                      :key="index"
                      class="display-item h-[4.625rem] animate-pulse border border-secondary bg-secondary/10"
                    />
                  </div>
                  <div v-else-if="matchHistories.length === 0" class="flex justify-center">
                    <span class="text-xl">No matches yet.</span>
                  </div>
                  <div v-else class="flex flex-col gap-4">
                    <div
                      v-for="matchHistory in matchHistories"
                      :key="matchHistory.id"
                      class="display-item border border-secondary bg-secondary/10"
                      tabindex="0"
                      aria-label="Match history"
                      :aria-describedby="`payment-history-${matchHistory.id}`"
                    >
                      <span>TODO</span>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </section>

          <footer class="dialog__panel--actions mt-6">
            <Transition
              enter-active-class="transition-opacity duration-300"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-opacity duration-300"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <button
                class="btn border-success text-success hover:[&:not(:disabled)]:bg-success hover:[&:not(:disabled)]:text-inherit focus:[&:not(:disabled)]:bg-success focus:[&:not(:disabled)]:text-inherit"
                type="submit"
                form="account-form"
                :disabled="isLoading"
                v-if="currentTab === 0"
              >
                Edit
                <IconSpinner v-show="isLoading" />
              </button>
            </Transition>
            <button
              class="btn border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
              :disabled="isLoading"
              @click="() => handleClose()"
            >
              Close
            </button>
          </footer>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
