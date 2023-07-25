<script setup>
  import {
    IconHome,
    IconUserPlus,
    IconPlayerPlay,
    IconHistory,
    IconShoppingBag,
    IconMoneybag,
    IconCards,
    IconLogin,
    IconLogout,
  } from '@tabler/icons-vue';
  import { useHead } from '@unhead/vue';
  import { useImage, useMagicKeys, useStorage } from '@vueuse/core';
  import { storeToRefs } from 'pinia';
  import { computed, defineAsyncComponent, ref, watch } from 'vue';
  import { RouterView, useRouter } from 'vue-router';

  import { useAuth } from '@/stores/auth';
  import { useMoneyModal } from '@/stores/money-modal';

  import OrundumCount from './components/OrundumCount.vue';
  import SideBar from './components/SideBar.vue';
  import IconLogo from './components/icon/IconLogo.vue';

  // Async components
  const CookieBanner = defineAsyncComponent(() => import('./components/CookieBanner.vue'));
  const AuthModal = defineAsyncComponent(() => import('./components/modal/AuthModal.vue'));
  const LogoutModal = defineAsyncComponent(() => import('./components/modal/LogoutModal.vue'));
  const MoneyModal = defineAsyncComponent(() => import('./components/modal/MoneyModal.vue'));

  const store = useAuth();
  const router = useRouter();
  const moneyModalStore = useMoneyModal();
  const cookieAccepted = useStorage('cookie-accepted', false, localStorage);
  const { auth } = storeToRefs(store);
  const isLogin = ref(true);
  const authModalOpened = ref(false);
  const logoutModalOpened = ref(false);
  const { isReady: backgroundImageReady } = useImage({ src: '/common/bg.jpg' });

  /**
   * @type {import('./components/SideBar.vue').SidebarItem[]} sidebarItems
   */
  const sidebarItems = computed(() => [
    { icon: IconHome, label: 'Home', to: '/' },
    { icon: IconPlayerPlay, label: 'Play', to: '/play', active: !!auth.value },
    { icon: IconCards, label: 'Squad', to: '/squad', active: !!auth.value },
    { icon: IconHistory, label: 'History', to: '/history', active: !!auth.value },
    { icon: IconMoneybag, label: 'Headhunt', to: '/headhunt', active: !!auth.value },
    { icon: IconShoppingBag, label: 'Store', to: '/store', active: !!auth.value },
    {
      icon: IconLogin,
      label: 'Login',
      onClick: () => {
        authModalOpened.value = true;
        isLogin.value = true;
      },
      active: !auth.value,
    },
    {
      icon: IconLogout,
      label: 'Logout',
      onClick: () => {
        logoutModalOpened.value = true;
      },
      active: !!auth.value,
    },
    {
      icon: IconUserPlus,
      label: 'Register',
      onClick: () => {
        authModalOpened.value = true;
        isLogin.value = false;
      },
      active: !auth.value,
    },
  ]);

  useHead({
    title: "Cartes de l'aube",
    meta: [
      { name: 'description', content: 'Arknights based card game.' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    ],
    // Prefetch operator background images
    link: [
      ...['common', 'rare', 'elite', 'senior'].map((rarity) => ({
        rel: 'prefetch',
        as: 'image',
        href: `/operator-bg/${rarity}.jpg`,
      })),
    ],
  });

  // Cheat code
  const keys = useMagicKeys();
  const shiftOM = keys['Shift+O+M'];

  watch(shiftOM, (v) => {
    if (v && auth.value) {
      moneyModalStore.openMoneyModal();
    }
  });
</script>

<template>
  <div class="flex h-full w-full flex-col overflow-hidden">
    <header class="z-10 flex-none">
      <div class="flex flex-col space-y-4 border-b border-surface/30 bg-primary p-4 shadow-md">
        <div class="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <RouterLink
            to="/"
            class="flex flex-none items-center justify-between gap-3"
            aria-label="Go to homepage"
            aria-describedby="app-title"
          >
            <IconLogo class="h-12 w-12" aria-hidden="true" />
            <span
              id="app-title"
              class="max-w-[7.5rem] break-words bg-gradient-to-br from-accent to-secondary bg-clip-text text-2xl font-bold leading-tight text-transparent"
              aria-hidden="true"
            >
              Cartes de l'aube
            </span>
          </RouterLink>
          <div class="flex-auto"></div>
          <div class="flex flex-none items-center space-x-4">
            <OrundumCount v-if="auth" :count="auth.orundum" />
          </div>
        </div>
      </div>
    </header>

    <div class="flex h-full w-full flex-auto flex-col overflow-hidden md:flex-row">
      <div
        class="flex flex-1 flex-col overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent scrollbar-corner-transparent"
        id="main-content"
      >
        <div class="relative flex-auto">
          <div class="absolute flex h-full w-full justify-center overflow-hidden">
            <img
              src="/common/bg.jpg"
              alt="Background image representing Lungmen city"
              aria-hidden="true"
              width="1920"
              height="1080"
              class="h-[1080px] max-w-none select-none blur-sm"
              v-if="backgroundImageReady"
            />
            <div v-else class="h-full w-full animate-pulse bg-[#0f1520]" aria-hidden="true" />
          </div>
          <main
            class="container relative inset-0 z-10 m-auto flex h-full flex-col items-center gap-10 object-cover px-5 py-10"
          >
            <RouterView />
          </main>
          <button
            type="button"
            class="absolute bottom-2 left-2 z-50 opacity-0 transition-all hover:opacity-100 focus-visible:opacity-100"
            aria-label="You found a secret! Press Shift + o + m to open it. Or just... You know, click this button."
            aria-keyshortcuts="Shift+o+m"
            @click="moneyModalStore.openMoneyModal()"
            v-if="router.currentRoute.value.name === 'store'"
          >
            <kbd class="kbd bg-secondary">Shift</kbd> + <kbd class="kbd bg-secondary">o</kbd> +
            <kbd class="kbd bg-secondary">m</kbd>
          </button>
          <CookieBanner :accepted="cookieAccepted" @accept="cookieAccepted = true" />
        </div>
      </div>

      <SideBar :items="sidebarItems" />
      <AuthModal :isOpen="authModalOpened" @close="authModalOpened = false" :isLogin="isLogin" />
      <LogoutModal :isOpen="logoutModalOpened" @close="logoutModalOpened = false" />
      <MoneyModal
        :isOpen="moneyModalStore.moneyModalOpened"
        @close="() => moneyModalStore.closeMoneyModal()"
      />
    </div>
  </div>
</template>
