<script setup>
  import { IconHeart } from '@tabler/icons-vue';

  import IconDeploymentCost from '../icon/IconDeploymentCost.vue';

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
    <span :aria-label="`${player.username} has ${player.hp} HP left.`">
      <IconHeart class="mr-1 inline-flex h-4 w-4 fill-white" /> {{ player.hp }} HP
    </span>
    <span :aria-label="`${player.username} has ${player.energy} energy left.`">
      <IconDeploymentCost class="mr-1 inline-flex h-4 w-4 fill-white" /> Sanity
    </span>
  </div>
</template>
