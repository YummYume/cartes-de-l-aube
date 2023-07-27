<script setup>
  import { useHead } from '@unhead/vue';
  import { defineAsyncComponent, ref } from 'vue';
  import { toast } from 'vue3-toastify';

  import { updateUser } from '@/api/admin/user';
  import UserList from '@/components/admin/UserList.vue';
  import { useAuth } from '@/stores/auth';

  const UserEditModal = defineAsyncComponent(() =>
    import('@/components/modal/admin/UserEditModal.vue')
  );

  useHead({
    title: 'Admin',
    meta: [
      {
        name: 'description',
        content: 'Admin page.',
      },
      {
        name: 'robots',
        content: 'noindex',
      },
      {
        name: 'googlebot',
        content: 'nofollow',
      },
    ],
  });

  /**
   * @type {import('vue').Ref<User|null>}
   */
  const selectedUser = ref(null);
  const userEditModalOpened = ref(false);
  const isLoading = ref(true);
  const updatedUser = ref(null);
  const { auth } = useAuth();

  /**
   * @param {User} user
   */
  const handleSelectUser = (user) => {
    selectedUser.value = user;
    userEditModalOpened.value = true;
  };

  const handleSave = async (values, { resetField }) => {
    isLoading.value = true;

    try {
      const user = await updateUser(selectedUser.value.id, {
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role,
      });

      if (auth.username === user.username) {
        auth.role = user.role;
      }

      updatedUser.value = user;

      resetField('password', '');
      resetField('confirmPassword', '');

      toast.success(`Successfully updated user ${user.username}.`);
    } catch (err) {
      if (err.status === 422) {
        toast.error(err.data.message);
      } else {
        toast.error('Failed to update user. Please try again later.');
      }
    }

    isLoading.value = false;
  };
</script>

<template>
  <h1 class="w-full text-center text-4xl">Admin</h1>
  <UserList @selectUser="handleSelectUser" :updatedUser="updatedUser" />
  <UserEditModal
    v-if="selectedUser !== null"
    :isOpen="userEditModalOpened"
    :isLoading="isLoading"
    :user="selectedUser"
    @close="userEditModalOpened = false"
    @save="handleSave"
  />
</template>
