<script setup>
  import { IconPlus } from '@tabler/icons-vue';
  import { computed, ref } from 'vue';
  import { useTippy } from 'vue-tippy';

  import IconOrundum from './icon/IconOrundum.vue';
  import StoreModal from './modal/StoreModal.vue';

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
  const storeModalOpened = ref(false);

  useTippy(plusBtn, {
    content: 'Buy Orundum',
  });
</script>

<template>
  <div role="group" class="flex flex-row items-center rounded-xl border-2 border-accent p-0.5 px-2">
    <IconOrundum class="h-5 w-5" aria-hidden="true" />
    <span class="ml-1 mr-2 text-lg font-bold" :aria-label="`${count} orundum`">{{
      formattedCount
    }}</span>
    <IconPlus
      class="h-5 w-5 rounded-full transition-all hover:bg-accent/50 focus-visible:bg-accent/50"
      aria-label="Buy"
      ref="plusBtn"
      @click="storeModalOpened = true"
    />
  </div>
  <StoreModal :isOpen="storeModalOpened" @close="storeModalOpened = false" />
</template>
