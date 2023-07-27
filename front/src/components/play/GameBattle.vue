<script setup>
  import { useFps } from '@vueuse/core';
  import { computed } from 'vue';

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

  defineEmits(['endTurn']);

  const fps = useFps();

  const currentPlayerTurn = computed(() => {
    if (props.currentTurn === props.currentUser.id) {
      return props.currentUser;
    }

    if (props.currentTurn === props.opponent.id) {
      return props.opponent;
    }

    return null;
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
        class="btn focus:not(:disabled)]:scale-105 w-40 rounded-md border-accent bg-accent text-white shadow-sm shadow-accent hover:[&:not(:disabled)]:scale-105 hover:[&:not(:disabled)]:shadow-lg hover:[&:not(:disabled)]:shadow-accent focus:[&:not(:disabled)]:shadow-lg focus:[&:not(:disabled)]:shadow-accent/75"
        type="button"
        :disabled="currentTurn !== currentUser.id"
        @click="$emit('endTurn')"
      >
        End turn
      </button>
      <GamePlayer
        :player="currentUser"
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
      <div class="flex flex-grow flex-row gap-4 overflow-x-auto overflow-y-hidden">
        <OperatorCard
          v-for="operator in opponent.battlefield"
          :key="operator.id"
          :operator="operator"
          :active="true"
          :withHighlight="false"
        />
      </div>
      <div class="flex flex-grow flex-row gap-4 overflow-x-auto overflow-y-hidden">
        <OperatorCard
          v-for="operator in currentUser.battlefield"
          :key="operator.id"
          :operator="operator"
          :active="true"
          :withHighlight="false"
        />
      </div>
      <div
        class="themed-scrollbar flex max-h-[24rem] flex-row gap-4 overflow-x-auto overflow-y-hidden"
      >
        <OperatorCard
          v-for="operator in currentUser.gameDeck"
          :key="operator.id"
          :operator="operator"
          :withHighlight="false"
          :description="`Deploy ${operator.name} to the battlefield.`"
        />
      </div>
    </div>
  </div>
</template>
