<script setup>
  import { IconPlus } from '@tabler/icons-vue';
  import gsap from 'gsap';
  import { reactive, ref, watch } from 'vue';
  import { useTippy } from 'vue-tippy';

  import IconOrundum from './icon/IconOrundum.vue';

  const props = defineProps({
    count: {
      type: Number,
      required: true,
    },
  });

  /**
   * @type {import('vue').Ref<VNodeRef>} plusBtn
   */
  const plusBtn = ref(null);
  const tweened = reactive({
    number: props.count,
  });

  watch(
    () => props.count,
    (n) => {
      gsap.to(tweened, { duration: 0.75, number: Number(n) || 0 });
    }
  );

  useTippy(plusBtn, {
    content: 'Go to the store to buy Orundum',
  });
</script>

<template>
  <div class="flex flex-row items-center rounded-xl border-2 border-accent p-0.5 px-2">
    <IconOrundum class="h-5 w-5" aria-hidden="true" />
    <span class="ml-1 mr-2 text-lg font-bold" :aria-label="`${count} orundum`">{{
      tweened.number.toLocaleString('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    }}</span>
    <RouterLink custom to="/store" v-slot="{ href, navigate }">
      <a :href="href" @click="navigate" aria-label="Buy Orundum" ref="plusBtn">
        <IconPlus
          class="h-5 w-5 cursor-pointer rounded-full transition-all hover:bg-accent/50 focus-visible:bg-accent/50"
          aria-hidden="true"
        />
      </a>
    </RouterLink>
  </div>
</template>
