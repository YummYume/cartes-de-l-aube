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
  import { RouterView } from 'vue-router';

  import SideBar from './components/SideBar.vue';

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
</script>

<template>
  <div class="flex h-full w-full flex-col overflow-hidden">
    <header class="z-10 flex-none">
      <div class="flex flex-col space-y-4 bg-primary p-4">
        <div class="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <div class="flex flex-none items-center justify-between">
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="50" height="50" />
          </div>
          <div class="flex-auto"></div>
          <div class="flex flex-none items-center space-x-4"></div>
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
