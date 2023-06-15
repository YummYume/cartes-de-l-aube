<script setup>
  import { ref } from 'vue';

  import AuthModal from './modal/AuthModal.vue';

  const authModalOpened = ref(false);
</script>

<template>
  <div role="group" class="transition-all rounded-xl bg-accent/50 border-2 border-transparent hover:bg-transparent hover:border-accent hover:text-accent p-0.5 px-2">
    <button
      aria-label="Authentication"
      @click="authModalOpened = true"
    >Sign In</button>
  </div>
  <AuthModal :isOpen="authModalOpened" @close="authModalOpened = false" />
</template>
