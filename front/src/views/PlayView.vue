<script setup>
  import { useWebSocket } from '@vueuse/core';
  import { defineAsyncComponent, reactive, ref } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { toast } from 'vue3-toastify';

  import GameBattle from '@/components/play/GameBattle.vue';
  import GameIntro from '@/components/play/GameIntro.vue';
  import GameSearch from '@/components/play/GameSearch.vue';
  import router from '@/router';
  import { useAuth } from '@/stores/auth';

  // Async components
  const ConfirmModal = defineAsyncComponent(() => import('@/components/modal/ConfirmModal.vue'));
  const GameResultModal = defineAsyncComponent(() =>
    import('@/components/modal/GameResultModal.vue')
  );

  // Defaults
  const defaultGameState = {
    user: null,
    opponent: null,
    totalTurn: 0,
    playerTurn: null,
    turnTimer: null,
    prepareTimer: null,
    surrenderTimer: null,
    status: 'waiting',
    actionTurn: {},
  };
  const defaultTimers = {
    turn: null,
    prepare: null,
    surrender: null,
  };

  const { auth } = useAuth();
  const confirmModalOpened = ref(false);
  /**
   * @type {import('vue').Ref<import('vue-router').RouteLocationNormalized|null>}
   */
  const leaveTo = ref(null);
  const isLoading = ref(false);
  const isSearching = ref(false);
  const isPlaying = ref(false);
  const isPreparationPhase = ref(false);
  /**
   * @type {import('vue').Ref<import('../utils/game').GameState>}
   */
  const gameState = ref(defaultGameState);
  const timers = reactive({
    turn: defaultTimers.turn,
    prepare: defaultTimers.prepare,
    surrender: defaultTimers.surrender,
  });
  const isFinished = ref(false);
  /**
   * @type {import('vue').Ref<'win'|'lose'>}
   */
  const gameResult = ref('lose');

  // WebSocket
  const { send, open, close } = useWebSocket(`${import.meta.env.VITE_WS_HOST}/match`, {
    autoClose: true,
    autoReconnect: {
      retries: 5,
      delay: 1000,
      onFailed() {
        if (isFinished.value) {
          return;
        }

        isLoading.value = false;
        isSearching.value = false;
        isPlaying.value = false;

        toast.error('Connection to the server lost. Please try refreshing the page.');
      },
    },
    immediate: false,
    onMessage(ws, event) {
      /**
       * @type {import('../utils/game').GameEvent<{}>} data
       */
      const eventData = JSON.parse(event.data);

      console.log(eventData);

      switch (eventData.type) {
        case 'waiting': {
          isLoading.value = false;
          isPlaying.value = false;
          isSearching.value = true;

          break;
        }

        case 'preparation-phase': {
          /**
           * @type {import('../utils/game').GameEvent<import('../utils/game').GameState>}
           */
          const data = eventData;

          gameState.value = data;
          isPreparationPhase.value = true;
          isLoading.value = false;
          isSearching.value = false;
          isPlaying.value = true;

          break;
        }

        case 'turn-phase': {
          /**
           * @type {import('../utils/game').GameEvent<import('../utils/game').GameState>}
           */
          const data = eventData;

          isPreparationPhase.value = false;
          gameState.value = data;

          break;
        }

        case 'timer-turn': {
          /**
           * @type {import('../utils/game').GameEvent<import('../utils/game').GameTimer>}
           */
          const data = eventData;

          isPreparationPhase.value = false;
          timers.turn = data.time;
          timers.prepare = null;
          timers.surrender = null;

          break;
        }

        case 'timer-preparation': {
          /**
           * @type {import('../utils/game').GameEvent<import('../utils/game').GameTimer>}
           */
          const data = eventData;

          timers.prepare = data.time;
          timers.surrender = null;
          timers.turn = null;

          break;
        }

        case 'timer-surrender': {
          /**
           * @type {import('../utils/game').GameEvent<import('../utils/game').GameTimer>}
           */
          const data = eventData;

          timers.surrender = data.time;
          timers.prepare = null;
          timers.turn = null;

          break;
        }

        case 'finish': {
          /**
           * @type {import('../utils/game').GameEvent<import('../utils/game').GameResult>}
           */
          const data = eventData;

          gameResult.value = data.result;
          isFinished.value = true;

          break;
        }

        case 'opponent-left': {
          if (isFinished.value) {
            return;
          }

          toast.info(
            'Your opponent has left the match. If they do not reconnect within 90 seconds, you will win the match.'
          );

          break;
        }

        case 'error': {
          /**
           * @type {import('../utils/game').GameEvent<import('../utils/game').GameError>}
           */
          const data = eventData;

          toast.error(data.message);

          break;
        }

        default:
          break;
      }
    },
  });

  const handleSearch = () => {
    if (isLoading.value) {
      return;
    }

    isLoading.value = true;

    open();
  };

  const handleLeave = () => {
    if (leaveTo.value === null) {
      return;
    }

    close();

    confirmModalOpened.value = false;
    isSearching.value = false;
    isPlaying.value = false;

    router.push({
      name: leaveTo.value.name,
      params: leaveTo.value.params,
      query: leaveTo.value.query,
      hash: leaveTo.value.hash,
    });
  };

  const handleClose = () => {
    leaveTo.value = null;
    confirmModalOpened.value = false;
  };

  const handleGameResultModalClose = () => {
    close();

    isFinished.value = false;
    isPlaying.value = false;
    isLoading.value = false;
    gameState.value = defaultGameState;
    timers.turn = defaultTimers.turn;
    timers.prepare = defaultTimers.prepare;
    timers.surrender = defaultTimers.surrender;
  };

  const handleCancelSearch = () => {
    if (!isSearching.value) {
      return;
    }

    close();

    isSearching.value = false;
  };

  const handleEndTurn = (userSelectedDeck, userAttack) => {
    send(
      JSON.stringify({
        type: 'action',
        actions: {
          deploys: userSelectedDeck.map(
            (deploy) =>
              // eslint-disable-next-line no-underscore-dangle
              deploy._id
          ),
          attacks: userAttack.map((attack) => ({
            initiator: attack.operator,
            target: attack.target,
          })),
        },
      })
    );
  };

  const handleEndPreparation = (userSelectedDeck) => {
    send(
      JSON.stringify({
        type: 'preparation-phase',
        cards: userSelectedDeck.map(
          (deploy) =>
            // eslint-disable-next-line no-underscore-dangle
            deploy._id
        ),
      })
    );
  };

  onBeforeRouteLeave((to, from, next) => {
    if (!isSearching.value && !isPlaying.value) {
      leaveTo.value = null;

      next();

      return;
    }

    confirmModalOpened.value = true;
    leaveTo.value = to;

    next(false);
  });
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    mode="out-in"
  >
    <GameSearch v-if="isSearching" @cancel="handleCancelSearch" />
    <GameBattle
      v-else-if="isPlaying"
      :currentUser="gameState.user"
      :opponent="gameState.opponent"
      :totalTurn="gameState.totalTurn"
      :currentTurn="timers.turn ? gameState.playerTurn : null"
      :isPreparationPhase="isPreparationPhase"
      :turnTimer="timers.turn"
      :prepareTimer="timers.prepare"
      :surrenderTimer="timers.surrender"
      @endTurn="handleEndTurn"
      @endPreparationPhase="handleEndPreparation"
    />
    <GameIntro
      v-else
      :isSubmitting="isLoading"
      :hasEmptySquad="auth.deck.length < 1"
      @search="handleSearch"
    />
  </Transition>
  <GameResultModal :isOpen="isFinished" :result="gameResult" @close="handleGameResultModalClose" />
  <ConfirmModal
    title="Hold on!"
    :message="
      isSearching
        ? 'You are currently searching for a match. Leaving this page will cancel the search. Are you sure you want to leave?'
        : 'You are currently in a match. Leaving this page will disconnect you from the match and will forfeit you if you do not reconnect within 90 seconds. Are you sure you want to leave?'
    "
    confirmText="Leave"
    cancelText="Stay"
    :isOpen="confirmModalOpened"
    @confirm="handleLeave"
    @cancel="handleClose"
  />
</template>
