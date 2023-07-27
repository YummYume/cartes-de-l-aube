<script setup>
  import { useWebSocket } from '@vueuse/core';
  import { ref } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { toast } from 'vue3-toastify';

  import ConfirmModal from '@/components/modal/ConfirmModal.vue';
  import GameBattle from '@/components/play/GameBattle.vue';
  import GameIntro from '@/components/play/GameIntro.vue';
  import GameSearch from '@/components/play/GameSearch.vue';
  import router from '@/router';
  import { useAuth } from '@/stores/auth';

  const { auth } = useAuth();
  const confirmModalOpened = ref(false);
  /**
   * @type {import('vue').Ref<import('vue-router').RouteLocationNormalized|null>}
   */
  const leaveTo = ref(null);
  const isLoading = ref(false);
  const isSearching = ref(false);
  const isPlaying = ref(false);
  const { status, send, open, close } = useWebSocket(`${import.meta.env.VITE_WS_HOST}/match`, {
    autoClose: true,
    autoReconnect: {
      retries: 5,
      delay: 1000,
      onFailed() {
        isLoading.value = false;
        isSearching.value = false;
        isPlaying.value = false;

        toast.error('Connection to the server lost. Please try refreshing the page.');
      },
    },
    immediate: false,
    onMessage(ws, event) {
      /**
       * @type {import('../utils/game').GameEvent} data
       */
      const eventData = JSON.parse(event.data);

      console.log(eventData);

      switch (eventData.type) {
        case 'waiting': {
          isLoading.value = false;
          isSearching.value = true;

          break;
        }

        case 'running': {
          /**
           * @type {import('../utils/game').GameEvent<import('../utils/game').GameState>}
           */
          const data = eventData;

          isLoading.value = false;
          isSearching.value = false;
          isPlaying.value = true;

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

  const handleCancelSearch = () => {
    if (!isSearching.value) {
      return;
    }

    close();

    isSearching.value = false;
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
    <GameBattle v-else-if="isPlaying" />
    <GameIntro
      v-else
      :isSubmitting="isLoading"
      :hasEmptySquad="auth.deck.length < 1"
      @search="handleSearch"
    />
  </Transition>
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
