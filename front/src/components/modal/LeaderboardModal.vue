<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue';
  import { ref, watch } from 'vue';
  import { toast } from 'vue3-toastify';

  import { getLeaderboard } from '@/api/leaderboard';
  import { useAuth } from '@/stores/auth';

  import BackdropModal from './BackdropModal.vue';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits(['close']);

  const { auth } = useAuth();
  const isLoading = ref(false);
  /**
   * @type {import('vue').Ref<User[]>}
   */
  const users = ref([]);
  /**
   * @type {import('vue').Ref<number|null>}
   */
  const currentUserRank = ref(null);
  const pr = new Intl.PluralRules('en', { type: 'ordinal' });
  const suffixes = new Map([
    ['one', 'st'],
    ['two', 'nd'],
    ['few', 'rd'],
    ['other', 'th'],
  ]);
  const formatOrdinals = (n) => {
    const rule = pr.select(n);
    const suffix = suffixes.get(rule);

    return `${n}${suffix}`;
  };
  const userColor = {
    1: 'display-item--senior',
    2: 'display-item--elite',
    3: 'display-item--rare',
  };
  let abortController = new AbortController();

  watch(
    () => props.isOpen,
    async (isOpen) => {
      if (isOpen) {
        try {
          isLoading.value = true;

          abortController.abort();
          abortController = new AbortController();

          const leaderboard = await getLeaderboard(abortController.signal);

          users.value = leaderboard.users;

          const userRank = leaderboard.users.findIndex((user) => user.id === auth.id);

          currentUserRank.value = userRank === -1 ? null : userRank + 1;
        } catch (error) {
          if (error.name !== 'AbortError') {
            toast.error(
              'Sorry, something went wrong while getting the leaderboard. Please try again later.'
            );

            emit('close');
          }
        } finally {
          isLoading.value = false;
        }
      } else {
        abortController.abort();
      }
    }
  );
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="$emit('close')" class="dialog">
      <BackdropModal />
      <TransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
        as="template"
      >
        <DialogPanel
          class="dialog__panel max-w-[95vw] bg-slate-700 text-slate-100 sm:max-w-xl lg:max-w-[60vw]"
        >
          <DialogTitle class="dialog__panel--title">Leaderboard</DialogTitle>
          <DialogDescription class="dialog__panel--description mt-2">
            Who is the best player in the world? Find out here!
          </DialogDescription>

          <section class="dialog__panel--section my-6" :aria-busy="isLoading">
            <div
              class="mb-4 max-h-[50vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-secondary scrollbar-corner-transparent"
            >
              <Transition
                enter-active-class="transition-opacity duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-300"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                mode="out-in"
              >
                <div v-if="isLoading" class="flex flex-col gap-4">
                  <div
                    v-for="index in 5"
                    :key="index"
                    :class="`display-item h-[4.625rem] animate-pulse border ${
                      userColor[index + 1] ?? ''
                    }`"
                  />
                </div>
                <div v-else-if="users.length === 0" class="flex justify-center">
                  <span class="text-xl">No users yet.</span>
                </div>
                <div v-else class="flex flex-col gap-4">
                  <div
                    v-for="(user, i) in users"
                    :key="user.id"
                    :class="`display-item border ${userColor[i + 1] ?? ''}`"
                    tabindex="0"
                    :aria-label="user.username"
                    :aria-describedby="`leaderboard-user-${user.id}`"
                  >
                    <div class="display-item__title-container" aria-hidden="true">
                      <span class="display-item__title">
                        {{ user.username }} <span v-if="currentUserRank === i + 1">(you)</span>
                      </span>
                      <span class="display-item__subtitle"> {{ user.rankingPoints }} points </span>
                    </div>
                    <strong class="display-item__info" aria-hidden="true">
                      {{ formatOrdinals(i + 1) }}
                    </strong>
                    <p class="sr-only" :id="`leaderboard-user-${user.id}`">
                      {{ user.username }} is ranked {{ formatOrdinals(i + 1) }} with
                      {{ user.rankingPoints }} points.
                    </p>
                  </div>
                </div>
              </Transition>
            </div>

            <Transition
              enter-active-class="transition-opacity duration-300"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-opacity duration-300"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
              mode="out-in"
            >
              <div v-if="isLoading" class="flex justify-center" aria-busy="true">
                <div class="h-7 w-40 animate-pulse rounded-md bg-white/75" />
              </div>
              <div v-else-if="currentUserRank !== null" class="flex justify-center">
                <span class="text-xl">
                  You are ranked <strong>{{ formatOrdinals(currentUserRank) }}</strong
                  >.
                </span>
              </div>
            </Transition>
          </section>

          <footer class="dialog__panel--actions mt-6">
            <button
              class="btn border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
              @click="$emit('close')"
            >
              Close
            </button>
          </footer>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="scss" scoped>
  .display-item {
    @apply border-secondary bg-secondary/10;

    &--senior {
      @apply border-[#ca841f] bg-[#ca841f]/10;
    }

    &--elite {
      @apply border-[#cfb88c] bg-[#cfb88c]/10;
    }

    &--rare {
      @apply border-[#9c8add] bg-[#9c8add]/10;
    }
  }
</style>
