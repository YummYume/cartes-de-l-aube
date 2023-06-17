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
  import { storeToRefs } from 'pinia';
  import { onBeforeMount, watch } from 'vue';
  import { RouterView } from 'vue-router';

  import { useAuth } from '@/stores/auth';

  import AuthButton from './components/AuthButton.vue';
  import OrundumCount from './components/OrundumCount.vue';
  import SideBar from './components/SideBar.vue';
  import IconLogo from './components/icon/IconLogo.vue';

  const store = useAuth();
  const { me, signin, signout } = store;
  const { auth } = storeToRefs(store);

  /**
   * @type {import('./components/SideBar.vue').SidebarItem[]} sidebarItems
   */
  const sidebarItems = [
    { icon: IconHome, label: 'Home', to: '/' },
    { icon: IconPlayerPlay, label: 'Play', to: '/play', active: true },
    { icon: IconCards, label: 'Squad', to: '/squad', active: true },
    { icon: IconHistory, label: 'History', to: '/history', active: true },
    { icon: IconMoneybag, label: 'Headhunt', to: '/headhunt', active: true },
    { icon: IconShoppingBag, label: 'Store', to: '/store', active: true },
    { icon: IconLogin, label: 'Login', to: '/login', active: true },
    {
      icon: IconLogout,
      label: 'Logout',
      onClick: () => {
        // TODO logout the user using a confirmation modal
        // eslint-disable-next-line no-alert, no-restricted-globals
        confirm('Are you sure you want to logout?');
      },
      active: false,
    },
    { icon: IconUserPlus, label: 'Register', to: '/register', active: false },
  ];

  watch(auth, () => console.log('auth state'));

  onBeforeMount(async () => {
    await me();
  });

  const login = async () => {
    await signin({ username: 'bobby', password: 'Qwertyuiop1' });
  };
  const logout = async () => {
    await signout();
  };
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
            <OrundumCount :count="500" />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>

    <div class="flex h-full w-full flex-auto flex-col overflow-hidden md:flex-row">
      <div class="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <div class="flex-auto">
          <RouterView />
        </div>
      </div>

      <SideBar :items="sidebarItems" />
    </div>
  </div>
</template>
