<script setup>
  import { ref } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { toast } from 'vue3-toastify';

  import { setPlayerSquad } from '@/api/squad';
  import PlayerSquad from '@/components/PlayerSquad.vue';
  import SquadSelectModal from '@/components/modal/SquadSelectModal.vue';
  import { useAuth } from '@/stores/auth';

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
  const toReplace = ref(null);
  const abortController = new AbortController();

  /**
   * @param {Operator} operatorToReplace
   */
  const handleOpen = (operatorToReplace) => {
    toReplace.value = operatorToReplace;
    squadSelectModalOpen.value = true;
  };

  const handleClose = () => {
    squadSelectModalOpen.value = false;
  };

  /**
   * @param {Operator} operator
   * @param {Operator|null} operatorToReplace
   */
  const handleSelect = async (operator, operatorToReplace) => {
    try {
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
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      toast.error('Sorry, something went wrong while updating your squad. Please try again later.');
    } finally {
      handleClose();
    }
  };

  /**
   * @param {Operator} operator
   */
  const handleRemove = async (operator) => {
    try {
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

      toast.error('Sorry, something went wrong while updating your squad. Please try again later.');
    } finally {
      handleClose();
    }
  };

  onBeforeRouteLeave(() => {
    abortController.abort();
  });
</script>

<template>
  <main class="container m-auto flex h-full flex-col items-center gap-10 p-5">
    <h1 class="w-full text-center text-4xl">My squad</h1>
    <section>
      <h2 class="m-auto mb-6 w-[62rem] max-w-full text-2xl">
        Define your best squad here, from the operators you pulled. This squad will be used during
        your next matches.
      </h2>
      <div
        class="my-6 mt-10 flex w-full flex-wrap items-center justify-center gap-14 overflow-x-clip"
      >
        <PlayerSquad :player="auth" :squad="playerSquad" @open="handleOpen" />
      </div>
    </section>
    <SquadSelectModal
      :isOpen="squadSelectModalOpen"
      :operators="operators"
      :toReplace="toReplace"
      @close="handleClose"
      @select="handleSelect"
      @remove="handleRemove"
    />
  </main>
</template>
