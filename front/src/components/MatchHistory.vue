<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    /**
     * @type {import('vue').PropType<MatchHistory>}
     */
    matchHistory: {
      type: Object,
      required: true,
    },
  });

  const firstPlayer = computed(() => props.matchHistory.players[0] ?? null);
  const secondPlayer = computed(() => props.matchHistory.players[1] ?? null);
</script>

<template>
  <div class="match-history">
    <div class="match-history__player">
      <img
        class="match-history__player-avatar"
        :src="firstPlayer.image"
        :alt="`Avatar of ${firstPlayer.username}`"
        v-if="firstPlayer.image"
        aria-hidden="true"
      />
      <span class="match-history__player-name">{{ firstPlayer.username }}</span>
    </div>
    <div class="match-history__result">
      <span class="duration">{{ matchHistory.endedAt - matchHistory.startedAt }}ms</span>
      <span>{{ matchHistory.startedAt.toLocaleDateString() }}</span>
    </div>
    <div class="match-history__player match-history__player--last">
      <img
        class="match-history__player-avatar"
        :src="secondPlayer.image"
        :alt="`Avatar of ${secondPlayer.username}`"
        v-if="secondPlayer.image"
        aria-hidden="true"
      />
      <span class="match-history__player-name">{{ secondPlayer.username }}</span>
    </div>
  </div>
</template>
