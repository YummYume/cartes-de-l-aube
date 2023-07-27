<script setup>
  defineProps({
    /**
     * @type {import('vue').PropType<import('../../utils/game').GameState['user']>}
     */
    player: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div class="flex flex-col gap-0.5" v-bind="$attrs">
    <span class="text-ellipsis text-xl font-semibold">{{ player.username }}</span>
    <span :aria-label="`${player.username} has ${player.hp} HP left.`">{{ player.hp }}</span>
    <span :aria-label="`${player.username} has ${player.energy} energy left.`">
      {{ player.energy }}
    </span>
  </div>
</template>
