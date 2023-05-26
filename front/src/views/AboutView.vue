<script setup>
  import { ref, onMounted } from 'vue';

  import { getExample } from '../api/example';

  /**
   * @type {import('vue').Ref<import('@/api/example').Example|null>} example
   */
  const example = ref(null);
  /**
   * @type {import('vue').Ref<null|string>} error
   */
  const error = ref(null);
  const loading = ref(true);

  const fetchExample = async () => {
    try {
      loading.value = true;
      example.value = await getExample();
    } catch (_) {
      error.value = 'Oops... Sorry, went wrong while fetching the example.';
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    await fetchExample();
  });
</script>

<template>
  <div class="about">
    <div class="post">
      <Transition>
        <div v-if="loading">
          <h2>Loading...</h2>
        </div>

        <div v-else-if="error">
          <h2>{{ error }}</h2>
        </div>

        <div v-else-if="example">
          <h2>{{ example.message }}</h2>
        </div>
      </Transition>
      <button
        type="button"
        class="mt-10 rounded-lg border border-primary bg-success px-5 py-2 text-primary transition-all hover:bg-primary hover:text-success"
        @click="fetchExample"
      >
        Refetch
      </button>
    </div>
  </div>
</template>

<style scoped>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
