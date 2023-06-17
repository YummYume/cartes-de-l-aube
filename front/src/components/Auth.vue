<script setup>
  import { ref } from 'vue';

  import AuthModal from './modal/AuthModal.vue';

  const authModalOpened = ref(false);
</script>

<template>
  <div
    role="group"
    class="rounded-xl border-2 border-transparent bg-accent/50 p-0.5 px-2 transition-all hover:border-accent hover:bg-transparent hover:text-accent"
  >
    <button aria-label="Authentication" @click="authModalOpened = true">Sign In</button>
  </div>
  <AuthModal :isOpen="authModalOpened" @close="authModalOpened = false" />
</template>
