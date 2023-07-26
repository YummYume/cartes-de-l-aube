<script setup>
  import { useOffsetPagination } from '@vueuse/core';
  import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
  import { toast } from 'vue3-toastify';

  import { getUsers } from '@/api/admin/user';
  import PaginationNavigation from '@/components/PaginationNavigation.vue';

  const props = defineProps({
    updatedUser: {
      validator: (value) => value === null || typeof value === 'object',
      default: null,
    },
  });

  /**
   * @type {{ users: User[], meta: { totalCount: number } }}
   */
  const usersWithPagination = reactive({
    users: [],
    meta: {
      totalCount: 0,
    },
  });
  const { currentPage, pageCount, isFirstPage, isLastPage, prev, next } = useOffsetPagination({
    total: usersWithPagination.meta.totalCount,
    page: 1,
    pageSize: 10,
  });
  const loading = ref(false);
  let abortController = new AbortController();

  defineEmits(['selectUser']);

  const fetchUsers = async () => {
    loading.value = true;

    try {
      abortController.abort();
      abortController = new AbortController();

      const data = await getUsers(currentPage, abortController.signal);

      usersWithPagination.users = data.users;
      usersWithPagination.meta.totalCount = data.meta.totalCount;
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }

      toast.error('Failed to retrieve users. Please try again later.');
    }

    loading.value = false;
  };

  watch(
    () => currentPage,
    () => {
      fetchUsers();
    }
  );

  watch(
    () => props.updatedUser,
    (updatedUser) => {
      if (updatedUser === null) {
        return;
      }

      usersWithPagination.users = usersWithPagination.users.map((user) => {
        if (user.username === updatedUser.username) {
          return updatedUser;
        }

        return user;
      });
    }
  );

  onMounted(() => {
    fetchUsers();
  });

  onUnmounted(() => {
    abortController.abort();
  });
</script>

<template>
  <section class="flex flex-col gap-10">
    <h2 class="text-center text-2xl font-semibold">
      {{
        loading
          ? 'Loading...'
          : `${usersWithPagination.meta.totalCount} user${
              usersWithPagination.meta.totalCount > 1 ? 's' : ''
            }`
      }}
    </h2>
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <div class="flex w-56 flex-col gap-2" v-if="!loading">
        <button
          class="user"
          type="button"
          v-for="user in usersWithPagination.users"
          :key="user.id"
          :aria-label="`Click to edit ${user.username}`"
          @click="$emit('selectUser', user)"
        >
          <span class="user__name">{{ user.username }}</span>
        </button>
      </div>
      <div class="flex w-56 flex-col gap-2" aria-busy="true" v-else>
        <div v-for="i in 10" :key="i" class="user h-16 animate-pulse" />
      </div>
    </Transition>
  </section>

  <PaginationNavigation
    aria-label="Navigate users"
    :isFirstPage="isFirstPage"
    :isLastPage="isLastPage"
    :currentPage="currentPage"
    :pageCount="pageCount"
    @navigate="(page) => (currentPage = page)"
    @prev="prev"
    @next="next"
  />
</template>

<style lang="scss" scoped>
  .user {
    @apply flex w-full items-center justify-start rounded-lg border-2 border-secondary bg-secondary/50 p-4 transition-all;

    &___name {
      @apply text-lg font-semibold;
    }

    &:hover,
    &:focus-visible {
      @apply scale-105;
    }
  }
</style>
