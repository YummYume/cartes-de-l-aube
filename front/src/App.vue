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
  import { useMagicKeys } from '@vueuse/core';
  import { storeToRefs } from 'pinia';
  import { computed, ref, watch } from 'vue';
  import { RouterView } from 'vue-router';

  import { useAuth } from '@/stores/auth';
  import { useMoneyModal } from '@/stores/money-modal';

  import OrundumCount from './components/OrundumCount.vue';
  import SideBar from './components/SideBar.vue';
  import IconLogo from './components/icon/IconLogo.vue';
  import AuthModal from './components/modal/AuthModal.vue';
  import LogoutModal from './components/modal/LogoutModal.vue';
  import MoneyModal from './components/modal/MoneyModal.vue';

  const store = useAuth();
  const moneyModalStore = useMoneyModal();
  const { auth } = storeToRefs(store);
  const isLogin = ref(true);
  const authModalOpened = ref(false);
  const logoutModalOpened = ref(false);

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
      <div class="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <div class="relative flex-auto">
          <RouterView />
        </div>
      </div>

      <SideBar :items="sidebarItems" />
      <AuthModal :isOpen="authModalOpened" @close="authModalOpened = false" :isLogin="isLogin" />
      <LogoutModal :isOpen="logoutModalOpened" @close="logoutModalOpened = false" />
      <MoneyModal
        :isOpen="moneyModalStore.moneyModalOpened"
        @close="moneyModalStore.closeMoneyModal()"
      />
    </div>
  </div>
</template>
