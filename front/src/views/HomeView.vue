<script setup>
  import { useHead } from '@unhead/vue';
  import { vIntersectionObserver } from '@vueuse/components';
  import { useImage } from '@vueuse/core';
  import gsap, { Power2 } from 'gsap';
  import { ref } from 'vue';

  import HomeDisclosure from '@/components/disclosure/HomeDisclosure.vue';
  import { useAuth } from '@/stores/auth';

  const { auth } = useAuth();
  /**
   * @type {import('vue').Ref<HTMLDivElement>}
   */
  const nearLightIntro = ref(null);
  /**
   * @type {import('vue').Ref<HTMLDivElement>}
   */
  const sagaIntro = ref(null);
  /**
   * @type {import('vue').Ref<HTMLDivElement>}
   */
  const amiyaIntro = ref(null);
  const { isReady: nearLightImageReady } = useImage({ src: '/home/near-light.jpg' });
  const { isReady: sagaImageReady } = useImage({ src: '/home/saga.jpeg' });
  const { isReady: amiyaImageReady } = useImage({ src: '/home/amiya.jpeg' });

  /**
   * @param {IntersectionObserverEntry[]} entries
   * @param {IntersectionObserver} observer
   * @param {'left' | 'right' | 'top' | 'bottom' | null} from
   */
  const introFrom = (entries, observer, from = 'left') => {
    entries.forEach((entry) => {
      let x = 0;
      let y = 0;

      if (from === 'left') {
        x = -100;
      } else if (from === 'right') {
        x = 100;
      } else if (from === 'top') {
        y = -100;
      } else if (from === 'bottom') {
        y = 100;
      }

      if (entry.isIntersecting) {
        gsap.fromTo(
          entry.target,
          {
            duration: 1,
            x,
            y,
            opacity: 0,
            ease: Power2.easeOut,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
          }
        );

        observer.unobserve(entry.target);
      }
    });
  };

  useHead({
    title: "Cartes de l'aube",
    meta: [{ name: 'description', content: 'Arknights based card game.' }],
  });
</script>

<template>
  <h1 class="w-full text-center text-4xl">Cartes de l'aube</h1>

  <div class="mt-5 flex max-w-7xl flex-col gap-16">
    <section ref="nearLightIntro" class="intro">
      <div
        class="intro__text-container"
        v-intersection-observer="[
          (entries, observer) => introFrom(entries, observer),
          { root: nearLightIntro, threshold: 0.5 },
        ]"
      >
        <h2 class="intro__title">A card game about Arknights</h2>
        <p class="intro__text">
          Cartes de l'aube is a card game based on the popular mobile game Arknights. Jump into the
          action and challenge your friends to a duel! We have a store, a headhunt page for you
          gacha lovers, and more. Each card represents an operator from Arknights, so you won't feel
          lost if you've played the game before.
        </p>
      </div>
      <div
        aria-hidden="true"
        class="w-full shrink-0 opacity-0 xl:w-auto"
        v-intersection-observer="[
          (entries, observer) => introFrom(entries, observer, 'right'),
          { root: nearLightIntro, threshold: 0.5 },
        ]"
      >
        <img
          src="/home/near-light.jpg"
          alt="A picture of the Near Light stage"
          class="intro__image ml-auto"
          width="600"
          height="338"
          v-if="nearLightImageReady"
        />
        <div v-else class="intro__image w-full bg-primary/50"></div>
      </div>
    </section>
    <section ref="sagaIntro" class="intro intro--reverse">
      <div
        class="intro__text-container"
        v-intersection-observer="[
          (entries, observer) => introFrom(entries, observer, 'right'),
          { root: sagaIntro, threshold: 0.5 },
        ]"
      >
        <h2 class="intro__title">All your favorite operators</h2>
        <p class="intro__text">
          All your favorite operators are here! Head to the headhunt page to pull for your most
          wanted operators. From the common 3-star to the rare 6-star, they are all here! You are
          granted {{ Number(12000).toLocaleString('en') }} orundum to start with, so spend them
          wisely!
        </p>
      </div>
      <div
        aria-hidden="true"
        class="w-full shrink-0 opacity-0 xl:w-auto"
        v-intersection-observer="[
          (entries, observer) => introFrom(entries, observer),
          { root: sagaIntro, threshold: 0.5 },
        ]"
      >
        <img
          src="/home/saga.jpeg"
          alt="A picture of Saga walking with a present"
          class="intro__image mr-auto"
          width="600"
          height="338"
          v-if="sagaImageReady"
        />
        <div v-else class="intro__image w-full bg-primary/50"></div>
      </div>
    </section>
    <section ref="amiyaIntro" class="intro">
      <div
        class="intro__text-container"
        v-intersection-observer="[
          (entries, observer) => introFrom(entries, observer),
          { root: amiyaIntro, threshold: 0.5 },
        ]"
      >
        <h2 class="intro__title">Show you're the best</h2>
        <p class="intro__text">
          Arknights is a great game, but it's even better with friends, right? Climb the leaderboard
          and show everyone you're the best! You can also check your game history to see how you've
          been doing and how you can improve.
        </p>
      </div>
      <div
        aria-hidden="true"
        class="w-full shrink-0 opacity-0 xl:w-auto"
        v-intersection-observer="[
          (entries, observer) => introFrom(entries, observer, 'right'),
          { root: amiyaIntro, threshold: 0.5 },
        ]"
      >
        <img
          src="/home/amiya.jpeg"
          alt="A picture of Amiya with a cat on a rooftop"
          class="intro__image ml-auto"
          width="600"
          height="338"
          v-if="amiyaImageReady"
        />
        <div v-else class="intro__image w-full bg-primary/50"></div>
      </div>
    </section>
  </div>

  <section
    class="mt-10 w-[62rem] max-w-full opacity-0"
    v-intersection-observer="[
      (entries, observer) => introFrom(entries, observer, 'bottom'),
      { threshold: 0.25 },
    ]"
  >
    <h2 class="mb-6 text-2xl">Frequently asked questions</h2>
    <HomeDisclosure :user="auth" />
  </section>
</template>

<style lang="scss" scoped>
  .intro {
    @apply flex flex-col items-center gap-3 xl:flex-row xl:items-start;

    &--reverse {
      @apply xl:flex-row-reverse;

      .intro__text-container {
        @apply text-right;
      }
    }

    &__text-container {
      @apply flex flex-grow flex-col gap-5 py-2 opacity-0;
    }

    &__title {
      @apply text-2xl font-bold;
    }

    &__text {
      @apply flex-grow text-lg;
    }

    &__image {
      @apply aspect-[25/14] rounded-xl border-4 border-primary shadow-xl drop-shadow-xl xl:w-[600px];
    }
  }
</style>
