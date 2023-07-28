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
    /**
     * @type {import('vue').PropType<number | null>}
     */
    energy: {
      validator: (value) => typeof value === 'number' || value === null,
      required: false,
      default: null,
    },
  });
</script>

<template>
  <div class="relative flex flex-col gap-0.5" v-bind="$attrs">
    <slot />
    <span class="text-ellipsis text-xl font-semibold">{{ player.username }}</span>
    <span :aria-label="`${player.username} has ${player.hp} HP left.`">
      <IconHeart class="mr-1 inline-flex h-4 w-4 fill-white" /> {{ player.hp }} HP
    </span>
    <span
      :aria-label="`${player.username} has ${
        energy !== null ? energy : player.energy
      } energy left.`"
    >
      <IconDeploymentCost class="mr-1 inline-flex h-4 w-4 fill-white" />
      {{ energy !== null ? energy : player.energy }} Sanity
    </span>
  </div>
</template>
