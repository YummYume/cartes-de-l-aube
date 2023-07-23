<script setup>
  import { computed } from 'vue';

  import OperatorCard from './OperatorCard.vue';

  const props = defineProps({
    /**
     * @type {import('vue').PropType<User>}
     */
    player: {
      type: Object,
      required: true,
    },
    /**
     * @type {import('vue').PropType<Operator[]>}
     */
    squad: {
      type: Array,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  });

  defineEmits(['open']);

  /**
   * @type {import('vue').ComputedRef<(Operator|null)[]>}
   */
  const fullSquad = computed(() => [...props.squad, ...Array(10 - props.squad.length).fill(null)]);
</script>

<template>
  <template v-for="(operator, i) in fullSquad" :key="i">
    <OperatorCard
      v-if="operator"
      :operator="operator"
      :active="active"
      @select="$emit('open', operator)"
    />
    <button
      type="button"
      v-else
      class="operator-empty-card flex h-[22rem] w-72 max-w-[90vw] items-center justify-center rounded-xl border-4 border-white p-1 text-center transition-all duration-300"
      @click="$emit('open', null)"
    >
      Click to add an operator
    </button>
  </template>
</template>

<style scoped lang="scss">
  .operator-empty-card {
    box-shadow: 0 0 0.6rem 0.05rem #fff;

    &:hover,
    &:focus-visible {
      box-shadow: 0 0 1.2rem 0.1rem #fff;
    }
  }
</style>
