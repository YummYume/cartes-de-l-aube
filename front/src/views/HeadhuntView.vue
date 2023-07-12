<script setup>
  import { computed, ref } from 'vue';
  import { onBeforeRouteLeave } from 'vue-router';
  import { useTippy } from 'vue-tippy';
  import { toast } from 'vue3-toastify';

  import { pull } from '@/api/headhunt';
  import HeadhuntDisclosure from '@/components/disclosure/HeadhuntDisclosure.vue';
  import IconSpinner from '@/components/icon/IconSpinner.vue';
  import HeadhuntModal from '@/components/modal/HeadhuntModal.vue';
  import { useAuth } from '@/stores/auth';

  const { auth } = useAuth();
  const pulls = ref(1);
  const maxPullCount = computed(() => Math.floor(auth.orundum / 600));
  const submitting = ref(false);
  const headhuntModalOpened = ref(false);
  const onePullButton = ref(null);
  const tenPullButton = ref(null);
  /**
   * @type {import('vue').Ref<Operator[]>}
   */
  const operators = ref([]);
  const abortController = new AbortController();

  useTippy(onePullButton, {
    content: `Pull 1 operator for ${Number(600).toLocaleString()} orundum`,
    theme: 'secondary',
    arrow: false,
  });

  useTippy(tenPullButton, {
    content: `Pull 10 operators for ${Number(6000).toLocaleString()} orundum`,
    theme: 'accent',
    arrow: false,
  });

  /**
   * @param {SubmitEvent} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    submitting.value = true;

    if (auth.orundum < 600 * pulls.value) {
      submitting.value = false;

      toast.error(`Not enough orundum to pull ${pulls.value} time${pulls.value > 1 ? 's' : ''}.`);

      return;
    }

    try {
      const results = await pull(pulls.value, abortController.signal);

      auth.orundum = results.orundum;
      operators.value = results.operators;
      submitting.value = false;
      headhuntModalOpened.value = true;
    } catch (error) {
      submitting.value = false;

      if (error.name === 'AbortError') {
        return;
      }

      toast.error('Something went wrong. Please try again later.');

      throw error;
    }
  };

  onBeforeRouteLeave(() => {
    abortController.abort();
  });
</script>

<template>
  <main class="container m-auto flex h-full flex-col items-center gap-10 p-5">
    <h1 class="w-full text-center text-4xl">Headhunt</h1>
    <section class="w-[62rem] max-w-full">
      <h2 class="mb-6 text-2xl">
        How are you going to win games without operators? Try your luck here!
      </h2>
      <form @submit="handleSubmit" class="flex flex-col gap-3">
        <p id="headhunt-pull-desc">
          Headhunting can be done in batches of 1 or 10. Each pull costs 600 orundum. A 10 pull will
          not guarantee a higher chance of getting a high rarity operator.
        </p>
        <p>
          You currently have <strong>{{ auth.orundum.toLocaleString() }}</strong> orundum, which is
          enough for a maximum of <strong>{{ maxPullCount.toLocaleString() }}</strong>
          {{ maxPullCount > 1 ? 'pulls' : 'pull' }}.
        </p>
        <p>
          Hungry for more operators? You can head to the
          <RouterLink class="link text-accent" to="/store">store</RouterLink> to buy more orundum.
        </p>
        <div class="mt-3 flex flex-row items-center justify-center gap-6">
          <button
            :disabled="submitting || auth.orundum < 600"
            :aria-busy="submitting"
            class="btn focus:not(:disabled)]:scale-105 w-36 rounded-md border-secondary text-secondary hover:bg-secondary hover:text-white focus:bg-secondary focus:text-white hover:[&:not(:disabled)]:scale-105 hover:[&:not(:disabled)]:shadow-lg hover:[&:not(:disabled)]:shadow-secondary focus:[&:not(:disabled)]:shadow-lg focus:[&:not(:disabled)]:shadow-secondary/75"
            type="submit"
            ref="onePullButton"
            @click="pulls = 1"
          >
            <span>Pull 1</span>
            <IconSpinner v-if="submitting && pulls === 1" />
          </button>
          <button
            :disabled="submitting || auth.orundum < 600 * 10"
            :aria-busy="submitting"
            class="btn focus:not(:disabled)]:scale-105 w-36 rounded-md border-accent text-accent hover:bg-accent hover:text-white focus:bg-accent focus:text-white hover:[&:not(:disabled)]:scale-105 hover:[&:not(:disabled)]:shadow-lg hover:[&:not(:disabled)]:shadow-accent focus:[&:not(:disabled)]:shadow-lg focus:[&:not(:disabled)]:shadow-accent/75"
            type="submit"
            ref="tenPullButton"
            @click="pulls = 10"
          >
            <span>Pull 10</span>
            <IconSpinner v-if="submitting && pulls === 10" />
          </button>
        </div>
      </form>
    </section>
    <section class="w-[62rem] max-w-full">
      <h2 class="mb-6 text-2xl">Headhunt FAQ</h2>
      <HeadhuntDisclosure />
    </section>
    <HeadhuntModal
      :isOpen="headhuntModalOpened"
      :operators="operators"
      @close="headhuntModalOpened = false"
    />
  </main>
</template>
