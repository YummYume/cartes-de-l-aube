<script setup>
  import { useIntervalFn, useSorted, useTimeAgo } from '@vueuse/core';
  import gsap from 'gsap';
  import { ref } from 'vue';

  import GameAdvice from './GameAdvice.vue';

  defineEmits(['cancel']);

  const advices = [
    'Did you know? Some operators are stronger than others.',
    'Try to use a squad with balanced stats. For example, a squad with only high attack operators will be weak against high defense operators.',
    'Although they look shiny, 6* operators are not always the best choice.',
    'You have 90 seconds to reconnect to a match after disconnecting. If you do not reconnect within this time, you will forfeit the match.',
    "You can win by reducing your opponent's health to 0, but you can also win by defeating all of their operators.",
    "You can't use the same operator twice in your squad.",
    'Operators have different classes which alert their stats. For example, defenders tend to have high defense and low attack.',
    'You can use the same operators as your opponent.',
    "You cannot see your opponents's squad. You will only see their operators when they are deployed.",
  ];
  const shuffledAdvices = useSorted(advices, () => Math.random() - 0.5);
  const advice = ref(shuffledAdvices.value[0]);

  /**
   * @param {HTMLElement} el
   * @param {() => void} done
   */
  const onEnter = (el, done) => {
    gsap.fromTo(
      el,
      {
        opacity: 0,
        x: 100,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.3,
        onComplete: done,
      }
    );
  };

  /**
   * @param {HTMLElement} el
   * @param {() => void} done
   */
  const onLeave = (el, done) => {
    gsap.fromTo(
      el,
      {
        opacity: 1,
        x: 0,
      },
      {
        opacity: 0,
        x: -100,
        duration: 0.3,
        onComplete: done,
      }
    );
  };

  const searchSince = useTimeAgo(new Date());
  const { pause, resume } = useIntervalFn(() => {
    const currentAdviceKey = shuffledAdvices.value.indexOf(advice.value);
    const nextAdviceKey = currentAdviceKey + 1;

    advice.value = shuffledAdvices.value[nextAdviceKey] ?? shuffledAdvices.value[0];
  }, 10000);
</script>

<template>
  <div class="contents">
    <h1 class="w-full text-center text-4xl" role="status">Searching a game...</h1>
    <h2 class="w-full text-center text-xl">
      Searching since : <strong>{{ searchSince }}</strong>
    </h2>
    <div class="flex min-h-[14rem] items-center justify-center">
      <Transition
        @enter="(el, done) => onEnter(el, done)"
        @leave="(el, done) => onLeave(el, done)"
        :css="false"
        mode="out-in"
      >
        <GameAdvice
          :key="shuffledAdvices.indexOf(advice)"
          :advice="advice"
          class="max-w-3xl"
          @mouseenter="() => pause()"
          @mouseleave="() => resume()"
        />
      </Transition>
    </div>
    <button
      class="btn focus:not(:disabled)]:scale-105 w-52 rounded-md border-accent bg-accent text-white shadow-sm shadow-accent hover:[&:not(:disabled)]:scale-105 hover:[&:not(:disabled)]:shadow-lg hover:[&:not(:disabled)]:shadow-accent focus:[&:not(:disabled)]:shadow-lg focus:[&:not(:disabled)]:shadow-accent/75"
      type="button"
      @click="$emit('cancel')"
    >
      <span>Cancel search</span>
    </button>
  </div>
</template>
