<script setup>
  import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from '@headlessui/vue';
  import { useHead } from '@unhead/vue';
  import { useMagicKeys } from '@vueuse/core';
  import { defineAsyncComponent, onBeforeUnmount, ref, watch } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { toast } from 'vue3-toastify';

  import { setPlayerSquad } from '@/api/squad';
  import PlayerSquad from '@/components/PlayerSquad.vue';
  import { useAuth } from '@/stores/auth';

  // Async components
  const SquadSelectModal = defineAsyncComponent(() =>
    import('@/components/modal/SquadSelectModal.vue')
  );

  const props = defineProps({
    /**
     * @type {import('vue').PropType<Operator[]>}
     */
    squad: {
      type: Array,
      required: true,
    },
    /**
     * @type {import('vue').PropType<Operator[]>}
     */
    availableOperators: {
      type: Array,
      required: true,
    },
  });

  const { auth } = useAuth();
  const squadSelectModalOpen = ref(false);
  const playerSquad = ref(props.squad);
  const operators = ref(props.availableOperators);
  /**
   * @type {import('vue').Ref<Operator|null>}
   */
  const toReplace = ref(null);
  const showDetails = ref(false);
  const loading = ref(false);
  const abortController = new AbortController();
  /**
   * @type {number|null}
   */
  let toastId = null;
  /**
   * @type {number|null}
   */
  let timeoutId = null;

  /**
   * @param {Operator} operatorToReplace
   */
  const handleOpen = (operatorToReplace) => {
    toReplace.value = operatorToReplace;
    squadSelectModalOpen.value = true;
  };

  const handleClose = () => {
    if (loading.value) {
      return;
    }

    squadSelectModalOpen.value = false;
  };

  const createLoadingToast = () => {
    if (toastId || timeoutId) {
      return;
    }

    timeoutId = window.setTimeout(() => {
      toastId = toast.loading('Saving your squad, please wait...');
    }, 500);
  };

  const removeLoadingToast = () => {
    if (toastId) {
      toast.remove(toastId);
      toastId = null;
    }

    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  /**
   * @param {Operator} operator
   * @param {Operator|null} operatorToReplace
   */
  const handleSelect = async (operator, operatorToReplace) => {
    if (loading.value) {
      return;
    }

    try {
      loading.value = true;
      createLoadingToast();

      const { availableOperators, squad: newSquad } = await setPlayerSquad(
        operatorToReplace
          ? playerSquad.value.map((o) =>
              o.name === operatorToReplace.name ? operator.name : o.name
            )
          : [...playerSquad.value, operator].map((o) => o.name),
        abortController.signal
      );

      operators.value = availableOperators;
      playerSquad.value = newSquad;
      auth.deck = newSquad.map((o) => o.name);
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      toast.error('Sorry, something went wrong while saving your squad. Please try again later.');
    } finally {
      loading.value = false;
      removeLoadingToast();
      handleClose();
    }
  };

  /**
   * @param {Operator} operator
   */
  const handleRemove = async (operator) => {
    if (loading.value) {
      return;
    }

    try {
      loading.value = true;
      createLoadingToast();

      const { availableOperators, squad: newSquad } = await setPlayerSquad(
        playerSquad.value.filter((o) => o.name !== operator.name).map((o) => o.name),
        abortController.signal
      );

      operators.value = availableOperators;
      playerSquad.value = newSquad;
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      toast.error('Sorry, something went wrong while saving your squad. Please try again later.');
    } finally {
      loading.value = false;
      removeLoadingToast();
      handleClose();
    }
  };

  const keys = useMagicKeys();
  const shiftT = keys['Shift+T'];

  watch(shiftT, (v) => {
    if (v) {
      showDetails.value = !showDetails.value;
    }
  });

  useHead({
    title: 'Squad',
    meta: [
      {
        name: 'description',
        content: 'Manage your squad here. Define your best squad to use during your next matches.',
      },
    ],
  });

  onBeforeRouteLeave(() => {
    abortController.abort();
  });

  onBeforeUnmount(() => {
    removeLoadingToast();
  });
</script>

<template>
  <h1 class="w-full text-center text-4xl">My squad</h1>
  <section class="w-full">
    <div class="m-auto mb-6 flex w-[62rem] max-w-full flex-col">
      <h2 class="text-2xl">
        Define your best squad here, from the operators you pulled. This squad will be used during
        your next matches. You currently have <strong>{{ operators.length }}</strong>
        {{ operators.length === 1 ? 'operator' : 'operators' }} available and
        {{ playerSquad.length }} {{ playerSquad.length === 1 ? 'operator' : 'operators' }} in your
        squad.
      </h2>
      <SwitchGroup class="mt-6 self-end">
        <div class="flex flex-row items-center gap-3">
          <SwitchLabel>
            Toggle operator details (<kbd class="kbd bg-secondary">Shift</kbd> +
            <kbd class="kbd bg-secondary">T</kbd>)
          </SwitchLabel>
          <SwitchDescription class="sr-only">
            Toggle detailed information about your operators.
          </SwitchDescription>
          <Switch
            v-model="showDetails"
            :class="showDetails ? 'bg-secondary' : 'bg-gray-200'"
            class="switch-input relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-keyshortcuts="Shift+T"
          >
            <span
              :class="showDetails ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            />
          </Switch>
        </div>
      </SwitchGroup>
    </div>
    <div
      class="my-6 mt-10 flex w-full flex-wrap justify-center gap-14 overflow-x-clip"
      :aria-busy="loading"
    >
      <PlayerSquad :player="auth" :squad="playerSquad" :active="showDetails" @open="handleOpen" />
    </div>
  </section>
  <SquadSelectModal
    :isOpen="squadSelectModalOpen"
    :operators="operators"
    :toReplace="toReplace"
    :active="showDetails"
    @close="handleClose"
    @select="handleSelect"
    @remove="handleRemove"
  />
</template>

<style lang="scss">
  @media screen and (max-width: 400px) {
    .switch-input {
      @apply w-16;
    }
  }
</style>
