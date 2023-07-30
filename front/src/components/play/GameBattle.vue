<script setup>
  import { useFps } from '@vueuse/core';
  import gsap, { Power2 } from 'gsap';
  import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';

  import { useHasGame } from '@/stores/has-game';

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
    /**
     * @type {import('vue').PropType<GameState['actionTurn']>}
     */
    actions: {
      type: Object,
      required: false,
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

  const { setHasGame } = useHasGame();
  const fps = useFps();
  const cardActions = reactive({
    deploys: [],
    attacks: [],
  });
  const players = reactive({
    user: props.currentUser,
    opponent: props.opponent,
  });
  const energyCost = ref(0);
  /**
   * @type {import('vue').Ref<Operator|null>}
   */
  const selectedOperator = ref(null);
  const energy = computed(() => players.user.energy - energyCost.value);
  const hasDeployed = ref(false);
  const currentPlayerTurn = computed(() => {
    if (props.currentTurn === players.user.id) {
      return players.user;
    }

    if (props.currentTurn === players.opponent.id) {
      return players.opponent;
    }

    return null;
  });
  const isPlayerTurn = computed(
    () => currentPlayerTurn.value?.id === players.user.id || props.isPreparationPhase
  );

  /**
   * @param {Operator & { _id: string }} operator
   * @returns {boolean}
   */
  const canSelectOperator = (operator) => {
    const isSelected = cardActions.deploys.some((op) => op._id === operator._id);

    return (
      isPlayerTurn.value &&
      (energy.value >= operator.statistics.cost || isSelected) &&
      (cardActions.deploys.length + players.user.battlefield.length < 4 || isSelected) &&
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

  /**
   * @param {Operator & { _id: string }} operator
   */
  const handleTargetSelect = (operator) => {
    if (!isPlayerTurn.value) {
      return;
    }

    if (!operator) {
      if (players.opponent.battlefield.length > 0) {
        return;
      }

      if (!selectedOperator.value) {
        cardActions.attacks = [];
      } else if (cardActions.attacks.some((atk) => atk.initiator === selectedOperator.value._id)) {
        cardActions.attacks = cardActions.attacks.filter(
          (atk) => atk.initiator !== selectedOperator.value._id
        );
      } else {
        cardActions.attacks = [
          ...cardActions.attacks,
          { initiator: selectedOperator.value._id, target: null },
        ];
      }
    } else if (!selectedOperator.value) {
      cardActions.attacks = cardActions.attacks.filter((atk) => atk.target !== operator._id);
    } else if (cardActions.attacks.some((atk) => atk.initiator === selectedOperator.value._id)) {
      cardActions.attacks = cardActions.attacks
        .map((atk) => {
          if (atk.initiator === selectedOperator.value._id) {
            if (atk.target === operator._id) {
              return null;
            }

            return { initiator: atk.initiator, target: operator._id };
          }

          return atk;
        })
        .filter((atk) => atk !== null);
    } else {
      cardActions.attacks = [
        ...cardActions.attacks,
        { initiator: selectedOperator.value._id, target: operator._id },
      ];
    }

    selectedOperator.value = null;
  };

  /**
   * @param {Operator & { _id: string }} operator
   * @returns {number[]}
   */
  const getAttackedIndexesForOperator = (operator) => {
    return cardActions.attacks
      .filter((atk) => atk.initiator === operator._id)
      .map(
        (atk) =>
          cardActions.attacks.findIndex(
            (op) => op.initiator === atk.initiator && op.target === atk.target
          ) + 1
      );
  };

  /**
   * @param {Operator & { _id: string } | null} operator
   * @returns {number[]}
   */
  const getTargetedIndexesForOperator = (operator) => {
    if (!operator) {
      return cardActions.attacks
        .filter((atk) => atk.target === null)
        .map(
          (atk) =>
            cardActions.attacks.findIndex(
              (op) => op.initiator === atk.initiator && op.target === atk.target
            ) + 1
        );
    }

    return cardActions.attacks
      .filter((atk) => atk.target === operator._id)
      .map(
        (atk) =>
          cardActions.attacks.findIndex(
            (op) => op.initiator === atk.initiator && op.target === atk.target
          ) + 1
      );
  };

  const handleEndTurn = () => {
    if (hasDeployed.value) {
      return;
    }

    if (props.isPreparationPhase) {
      emit('endPreparationPhase', cardActions.deploys);
      energyCost.value = 0;
      hasDeployed.value = true;

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

  watch(
    () => props.actions,
    () => {
      if (!props.actions) {
        players.user = props.currentUser;
        players.opponent = props.opponent;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          players.user = props.currentUser;
          players.opponent = props.opponent;
        },
        paused: true,
      });

      if (props.actions?.attacks) {
        props.actions.attacks.forEach((attack) => {
          const initiator =
            currentPlayerTurn.value?.id === props.currentUser.id ? 'user' : 'opponent';
          const target = currentPlayerTurn.value?.id === props.currentUser.id ? 'opponent' : 'user';

          const initiatorCard = document.querySelector(
            `#${initiator}-battlefield-${attack.initiator}`
          );
          const targetCard = document.querySelector(
            attack.target ? `#${target}-battlefield-${attack.target}` : `#${target}-player`
          );

          if (!initiatorCard || !targetCard) {
            return;
          }

          tl.to(initiatorCard, {
            x: targetCard.offsetLeft - initiatorCard.offsetLeft,
            y: targetCard.offsetTop - initiatorCard.offsetTop,
            duration: 0.5,
            zIndex: 999,
            ease: Power2.easeOut,
          }).to(initiatorCard, {
            x: 0,
            y: 0,
            duration: 0.5,
            zIndex: 0,
            ease: Power2.easeIn,
          });
        });
      }

      tl.play();
    }
  );

  watch(
    () => props.currentTurn,
    () => {
      cardActions.deploys = [];
      cardActions.attacks = [];
      energyCost.value = 0;
      selectedOperator.value = null;
      hasDeployed.value = false;
    }
  );

  onMounted(() => {
    setHasGame(true);
  });

  onBeforeUnmount(() => {
    setHasGame(false);
  });
</script>

<template>
  <div class="absolute inset-0 flex h-full w-full gap-2 overflow-hidden p-1 sm:p-4">
    <div class="flex max-w-[20%] flex-col justify-between">
      <GamePlayer
        :player="players.opponent"
        :aria-label="`${players.opponent.username} has ${players.opponent.hp} HP and ${players.opponent.energy} energy left.`"
        id="opponent-player"
        class="themed-scrollbar overflow-auto rounded-lg border border-accent bg-accent/40 p-2 shadow-md drop-shadow-md scrollbar-thumb-accent"
        role="button"
        tabindex="0"
        @click="() => handleTargetSelect()"
      >
        <Transition
          enter-active-class="transition-opacity duration-150"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <span
            class="absolute right-1 top-1 z-50 flex flex-col gap-0.5 text-right"
            v-if="getTargetedIndexesForOperator(null).length > 0"
          >
            {{ getTargetedIndexesForOperator(null).join(' ') }}
          </span>
        </Transition>
      </GamePlayer>
      <button
        class="btn focus:not(:disabled)]:scale-105 w-40 rounded-md border-success bg-success text-white shadow-sm shadow-success hover:[&:not(:disabled)]:scale-105 hover:[&:not(:disabled)]:shadow-lg hover:[&:not(:disabled)]:shadow-success focus:[&:not(:disabled)]:shadow-lg focus:[&:not(:disabled)]:shadow-success/75"
        type="button"
        :disabled="isPreparationPhase ? hasDeployed : !isPlayerTurn || hasDeployed"
        @click="() => handleEndTurn()"
      >
        End turn
      </button>
      <GamePlayer
        :player="players.user"
        :aria-label="`You have ${players.user.hp} HP and ${energy} energy left.`"
        :energy="energy"
        id="user-player"
        tabindex="0"
        class="themed-scrollbar overflow-auto rounded-lg border border-secondary bg-secondary/40 p-2 shadow-md drop-shadow-md"
      />
    </div>

    <div class="relative flex flex-grow flex-col overflow-hidden">
      <div class="absolute right-1 top-1 z-50 flex flex-col gap-0.5 text-right">
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
          <div class="flex flex-col text-right" v-if="turnTimer">
            <span v-if="currentPlayerTurn">{{ currentPlayerTurn.username }}'s turn</span>
            <span>{{ turnTimer }}</span>
          </div>
          <div class="flex flex-col text-right" v-else-if="prepareTimer">
            <span>Prepare for battle</span>
            <span>{{ prepareTimer }}</span>
          </div>
          <div class="flex flex-col gap-0.5 text-right text-warning" v-else-if="surrenderTimer">
            <span>{{ players.opponent.username }} is disconnected</span>
            <span>Game ends in {{ surrenderTimer }}</span>
          </div>
          <div v-else>
            <span>Idle time</span>
          </div>
        </Transition>
      </div>

      <div class="flex flex-grow flex-row gap-8 overflow-x-auto overflow-y-hidden px-10">
        <OperatorCard
          v-for="operator in players.opponent.battlefield"
          :key="operator.id"
          :operator="{ ...operator.operator, statistics: operator.statistics }"
          :active="true"
          :withHighlight="false"
          :id="`opponent-battlefield-${operator.operator._id}`"
          :class="`operator-card--compact h-60 min-w-[13rem] flex-shrink basis-52 ${
            isPlayerTurn ? 'cursor-pointer' : 'cursor-not-allowed'
          }`"
          @select="handleTargetSelect"
        >
          <TransitionGroup
            enter-active-class="transition-opacity duration-150"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            mode="out-in"
            tag="div"
            class="absolute left-1 top-1 z-50 flex flex-col gap-0.5"
          >
            <span
              class="rounded-full border-secondary bg-secondary/80 p-0.5"
              v-for="num in getTargetedIndexesForOperator(operator.operator)"
              :key="num"
            >
              {{ num }}
            </span>
          </TransitionGroup>
        </OperatorCard>
      </div>
      <div class="flex flex-grow flex-row gap-8 overflow-x-auto overflow-y-hidden px-10">
        <OperatorCard
          v-for="operator in players.user.battlefield"
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
          <TransitionGroup
            enter-active-class="transition-opacity duration-150"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            mode="out-in"
            tag="div"
            class="absolute left-1 top-1 z-50 flex flex-col gap-0.5"
          >
            <span
              class="rounded-full border-secondary bg-secondary/80 p-0.5"
              v-for="num in getAttackedIndexesForOperator(operator.operator)"
              :key="num"
            >
              {{ num }}
            </span>
          </TransitionGroup>
        </OperatorCard>
      </div>
      <div
        class="themed-scrollbar flex max-h-72 w-full flex-row items-center gap-4 overflow-x-auto overflow-y-clip p-3"
      >
        <OperatorCard
          v-for="operator in players.user.gameDeck"
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
