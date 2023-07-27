<script setup>
  import gsap, { Power4, Back } from 'gsap';
  import { ref } from 'vue';

  import { useAboutModal } from '@/stores/about-modal';

  defineProps({
    accepted: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  defineEmits(['accept']);

  /**
   * @type {import('vue').Ref<HTMLDivElement>}
   */
  const cookieBanner = ref(null);
  const aboutModalStore = useAboutModal();

  /**
   * @param {HTMLDivElement} el
   * @param {() => void} done
   * @param {boolean} isAppear
   */
  const onEnterOrAppear = (el, done, isAppear = false) => {
    const tl = gsap.timeline({ onComplete: () => done() });

    tl.fromTo(
      el,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        delay: isAppear ? 2 : 0,
        ease: Back.easeInOut,
      }
    );
  };

  /**
   * @param {HTMLDivElement} el
   * @param {() => void} done
   */
  const onLeave = (el, done) => {
    const tl = gsap.timeline({ onComplete: () => done() });

    tl.to(el, {
      duration: 0.5,
      y: 100,
      opacity: 0,
      ease: Power4.easeIn,
    });
  };
</script>

<template>
  <Transition
    @enter="(el, done) => onEnterOrAppear(el, done)"
    @appear="(el, done) => onEnterOrAppear(el, done, true)"
    @leave="(el, done) => onLeave(el, done)"
    :css="false"
    appear
  >
    <div
      ref="cookieBanner"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-message"
      class="fixed bottom-16 left-2 right-2 z-50 flex flex-col gap-5 rounded-md border-4 border-primary bg-surface p-4 shadow-md md:bottom-2 md:right-auto md:w-[30rem]"
      v-if="!accepted"
    >
      <div class="flex flex-col gap-2">
        <h2 id="cookie-banner-title" class="text-3xl">About the cookies we use</h2>
        <p id="cookie-banner-message">
          Cartes de l'aube uses cookies to improve and secure your experience on this website. By
          continuing to use this website, you accept the use of cookies. You can learn more about
          our cookies policy and what each cookie means in our
          <button
            type="button"
            class="link text-accent"
            @click="() => aboutModalStore.openAboutModal()"
          >
            cookie policy
          </button>
          section.
        </p>
      </div>
      <div class="flex items-center justify-center">
        <button
          class="btn rounded-md border-success px-8 py-4 text-success transition-all hover:bg-success hover:text-white"
          type="button"
          @click="$emit('accept')"
        >
          I Agree
        </button>
      </div>
    </div>
  </Transition>
</template>
