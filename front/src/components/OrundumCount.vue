<script setup>
  import { IconPlus } from '@tabler/icons-vue';
  import { computed, ref } from 'vue';
  import { useTippy } from 'vue-tippy';

  import IconOrundum from './icon/IconOrundum.vue';

  const props = defineProps({
    count: {
      type: Number,
      required: true,
    },
  });

  const plusBtn = ref(null);
  const formattedCount = computed(() =>
    props.count.toLocaleString('en', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );

  useTippy(plusBtn, {
    content: 'Go to the store to buy Orundum',
  });
</script>

<template>
  <div class="flex flex-row items-center rounded-xl border-2 border-accent p-0.5 px-2">
    <IconOrundum class="h-5 w-5" aria-hidden="true" />
    <span class="ml-1 mr-2 text-lg font-bold" :aria-label="`${count} orundum`">{{
      formattedCount
    }}</span>
    <RouterLink to="/store">
      <IconPlus
        class="h-5 w-5 cursor-pointer rounded-full transition-all hover:bg-accent/50 focus-visible:bg-accent/50"
        ref="plusBtn"
        aria-label="Buy Orundum"
      />
    </RouterLink>
  </div>
</template>
