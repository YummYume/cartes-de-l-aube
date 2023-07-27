<script setup>
  import { useFps } from '@vueuse/core';
  import { computed, reactive, ref, watch } from 'vue';

  import GamePlayer from './GamePlayer.vue';

  import OperatorCard from '../OperatorCard.vue';

  /**
   * @typedef {import('../../utils/game').GameState} GameState
   */

  const props = defineProps({
    /**
     * @type {import('vue').PropType<GameState['user']>}
     */
    currentUser: {
      type: Object,
      required: true,
    },
    /**
     * @type {import('vue').PropType<GameState['opponent']>}
     */
    opponent: {
      type: Object,
      required: true,
    },
    totalTurn: {
      type: Number,
      required: true,
    },
    isPreparationPhase: {
      type: Boolean,
      required: true,
    },
    /**
     * @type {import('vue').PropType<number | null>}
     */
    currentTurn: {
      validator: (value) => typeof value === 'number' || value === null,
      default: null,
    },
    /**
     * @type {import('vue').PropType<number | null>}
     */
    turnTimer: {
      validator: (value) => typeof value === 'number' || value === null,
      default: null,
    },
    /**
     * @type {import('vue').PropType<number | null>}
     */
    prepareTimer: {
      validator: (value) => typeof value === 'number' || value === null,
      default: null,
    },
    /**
     * @type {import('vue').PropType<number | null>}
     */
    surrenderTimer: {
      validator: (value) => typeof value === 'number' || value === null,
      default: null,
    },
  });

  const emit = defineEmits(['endTurn', 'endPreparationPhase']);

  const fps = useFps();
  const cardActions = reactive({
    deploys: [],
    attacks: [],
  });
  const energyCost = ref(0);
  const selectedOperator = ref(null);
  const energy = computed(() => props.currentUser.energy - energyCost.value);
  const hasDeployed = ref(false);
  const currentPlayerTurn = computed(() => {
    if (props.currentTurn === props.currentUser.id) {
      return props.currentUser;
    }

    if (props.currentTurn === props.opponent.id) {
      return props.opponent;
    }

    return null;
  });
  const isPlayerTurn = computed(
    () => currentPlayerTurn.value?.id === props.currentUser.id || props.isPreparationPhase
  );

  const canSelectOperator = (operator) => {
    const isSelected = cardActions.deploys.some((op) => op._id === operator._id);

    return (
      isPlayerTurn.value &&
      (energy.value >= operator.statistics.cost || isSelected) &&
      (cardActions.deploys.length < 4 || isSelected) &&
      !(hasDeployed.value && props.isPreparationPhase)
    );
  };

  /**
   * @param {Operator & { _id: string }} operator
   */
  const handleDeckSelect = (operator) => {
    if (!canSelectOperator(operator)) {
      return;
    }

    if (cardActions.deploys.some((op) => op._id === operator._id)) {
      cardActions.deploys = cardActions.deploys.filter((op) => op._id !== operator._id);

      energyCost.value -= operator.statistics.cost;
    } else {
      if (energy.value < operator.statistics.cost) {
        return;
      }

      cardActions.deploys = [...cardActions.deploys, operator];

      energyCost.value += operator.statistics.cost;
    }
  };

  const handleTargetSelect = (operator) => {
    if (
      !isPlayerTurn.value ||
      cardActions.attacks.some((atk) => atk.initiator === selectedOperator.value?._id)
    ) {
      return;
    }

    if (!selectedOperator.value) {
      cardActions.attacks = cardActions.attacks.filter((atk) => atk.target !== operator._id);
    } else if (cardActions.attacks.some((atk) => atk.target === operator._id)) {
      cardActions.attacks = cardActions.attacks.filter(
        (atk) => atk.target !== operator._id && atk.initiator === selectedOperator.value?._id
      );
    }

    cardActions.attacks = [
      ...cardActions.attacks,
      { initiator: selectedOperator.value._id, target: operator._id },
    ];
  };

  const getAttackedIndexesForOperator = (operator) => {
    return cardActions.attacks
      .filter((atk) => atk.initiator === operator._id)
      .map((atk) => cardActions.deploys.findIndex((op) => op._id === atk.initiator) + 1);
  };

  const getTargetedIndexesForOperator = (operator) => {
    return cardActions.attacks
      .filter((atk) => atk.target === operator._id)
      .map((atk) => cardActions.deploys.findIndex((op) => op._id === atk.target) + 1);
  };

  const handleEndTurn = () => {
    if (props.isPreparationPhase) {
      emit('endPreparationPhase', cardActions.deploys);
      energyCost.value = 0;
      hasDeployed.value = true;
      cardActions.deploys = [];
      cardActions.attacks = [];

      return;
    }

    if (!isPlayerTurn.value) {
      return;
    }

    emit('endTurn', cardActions.deploys, cardActions.attacks);
    energyCost.value = 0;
    hasDeployed.value = true;
    cardActions.deploys = [];
    cardActions.attacks = [];
  };

  watch([props.turnTimer, props.prepareTimer, props.surrenderTimer], () => {
    cardActions.deploys = [];
    cardActions.attacks = [];
    energyCost.value = 0;
    selectedOperator.value = null;
    hasDeployed.value = false;
  });
</script>

<template>
  <div class="absolute inset-0 flex h-full w-full gap-2 overflow-hidden p-1 sm:p-4">
    <div class="flex max-w-[20%] flex-col justify-between">
      <GamePlayer
        :player="opponent"
        class="themed-scrollbar overflow-auto rounded-lg border border-accent bg-accent/40 p-2 shadow-md drop-shadow-md scrollbar-thumb-accent"
      />
      <button
        class="btn focus:not(:disabled)]:scale-105 w-40 rounded-md border-success bg-success text-white shadow-sm shadow-success hover:[&:not(:disabled)]:scale-105 hover:[&:not(:disabled)]:shadow-lg hover:[&:not(:disabled)]:shadow-success focus:[&:not(:disabled)]:shadow-lg focus:[&:not(:disabled)]:shadow-success/75"
        type="button"
        :disabled="isPreparationPhase ? hasDeployed : !isPlayerTurn"
        @click="() => handleEndTurn()"
      >
        End turn
      </button>
      <GamePlayer
        :player="currentUser"
        :energy="energy"
        class="themed-scrollbar overflow-auto rounded-lg border border-secondary bg-secondary/40 p-2 shadow-md drop-shadow-md"
      />
    </div>

    <div class="relative flex flex-grow flex-col overflow-hidden">
      <div class="absolute right-1 top-1 flex flex-col gap-0.5 text-right">
        <span>{{ fps }} FPS</span>
        <span>Turn {{ totalTurn }}</span>
        <Transition
          enter-active-class="transition-opacity duration-150"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <div class="flex flex-col" v-if="turnTimer">
            <span v-if="currentPlayerTurn">{{ currentPlayerTurn.username }}'s turn</span>
            <span>{{ turnTimer }}</span>
          </div>
          <div class="flex flex-col" v-else-if="prepareTimer">
            <span>Prepare for battle</span>
            <span>{{ prepareTimer }}</span>
          </div>
          <div class="flex flex-col gap-0.5 text-warning" v-else-if="surrenderTimer">
            <span>{{ opponent.username }} is disconnected</span>
            <span>Game ends in {{ surrenderTimer }}</span>
          </div>
          <div v-else>
            <span>Idle time</span>
          </div>
        </Transition>
      </div>

      <div class="flex flex-grow flex-row gap-8 overflow-x-auto overflow-y-hidden px-10">
        <OperatorCard
          v-for="operator in opponent.battlefield"
          :key="operator.id"
          :operator="{ ...operator.operator, statistics: operator.statistics }"
          :active="true"
          :withHighlight="false"
          :id="`opponent-battlefield-${operator.operator._id}`"
          class="operator-card--compact h-60 min-w-[13rem] flex-shrink basis-52"
          @select="handleTargetSelect"
        >
          <span>{{ getTargetedIndexesForOperator(operator.operator) }}</span>
        </OperatorCard>
      </div>
      <div class="flex flex-grow flex-row gap-8 overflow-x-auto overflow-y-hidden px-10">
        <OperatorCard
          v-for="operator in currentUser.battlefield"
          :key="operator.id"
          :operator="{ ...operator.operator, statistics: operator.statistics }"
          :active="true"
          :withHighlight="false"
          :id="`user-battlefield-${operator.operator._id}`"
          :aria-disabled="!isPlayerTurn"
          :class="`operator-card--compact h-60 min-w-[13rem] flex-shrink basis-52 transition-all ${
            isPlayerTurn ? 'cursor-pointer' : 'cursor-not-allowed'
          } ${selectedOperator?._id === operator.operator._id ? 'scale-110' : ''}`"
          @select="
            (operator) => {
              if (!isPlayerTurn) {
                return;
              }

              if (selectedOperator?._id === operator._id) {
                selectedOperator = null;

                return;
              }

              selectedOperator = operator;
            }
          "
        >
          <span>{{ getAttackedIndexesForOperator(operator.operator) }}</span>
        </OperatorCard>
      </div>
      <div
        class="themed-scrollbar flex max-h-72 w-full flex-row items-center gap-4 overflow-x-auto overflow-y-clip p-3"
      >
        <OperatorCard
          v-for="operator in currentUser.gameDeck"
          :key="operator.id"
          :operator="operator"
          :withHighlight="false"
          :active="cardActions.deploys.some((op) => op._id === operator._id)"
          :description="
            cardActions.deploys.some((op) => op._id === operator._id)
              ? `Keep ${operator.name} in your deck.`
              : `Deploy ${operator.name} on the battlefield.`
          "
          :id="`user-deck-${operator._id}`"
          :class="`operator-card--compact h-56 min-w-[12rem] flex-shrink basis-48 ${
            canSelectOperator(operator) ? 'cursor-pointer' : 'cursor-not-allowed'
          }`"
          :aria-disabled="!canSelectOperator(operator)"
          @select="handleDeckSelect"
        />
      </div>
    </div>
  </div>
</template>
