<script setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { Form } from 'vee-validate';
  import { toast } from 'vue3-toastify';

  import IconSpinner from '@/components/icon/IconSpinner.vue';
  import { useAuth } from '@/stores/auth';
  import { registerValidation, loginValidation } from '@/utils/validation/authValidation';

  import InputField from './InputField.vue';

  const store = useAuth();
  const { signin, signup } = store;

  const props = defineProps({
    isLogin: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits(['onAsyncSubmit']);

  const onSubmit = async (values) => {
    emit('onAsyncSubmit', 'progress');
    try {
      if (props.isLogin) {
        await signin(values);
      } else {
        await signup(values);
      }

      emit('onAsyncSubmit', 'done');
    } catch (error) {
      if (props.isLogin) {
        if (error.status === 401) {
          toast.error('Invalid credentials.');
        }
      } else if (error.status === 409) {
        toast.error('Username already exists.');
      } else if (error.status === 422) {
        toast.error('Invalid username or password.');
      } else {
        toast.error('Something went wrong.');
      }

      emit('onAsyncSubmit', 'fail');
    }
  };
</script>

<template>
  <Form
    @submit="onSubmit"
    :validation-schema="toTypedSchema(isLogin ? loginValidation : registerValidation)"
    v-slot="{ isSubmitting, meta }"
    class="flex flex-col gap-5"
  >
    <InputField
      id="username"
      name="username"
      label="Username"
      type="text"
      placeholder="Enter your username"
      :infoTagMsg="isLogin ? null : 'Your username must contain 3 to 15 characters.'"
      :is-required="true"
    />
    <InputField
      id="password"
      name="password"
      label="Password"
      type="password"
      placeholder="Enter your password"
      :infoTagMsg="
        isLogin
          ? null
          : 'Your password must contain 8 to 40 characters, including at least 1 lowercase letter, 1 uppercase letter and 1 digit.'
      "
      :is-required="true"
    />
    <InputField
      v-if="!isLogin"
      id="confirmPassword"
      name="confirmPassword"
      label="Confirm password"
      type="password"
      placeholder="Confirm your password"
      :is-required="true"
    />
    <slot :isSubmitting="isSubmitting" :meta="meta">
      <div class="flex justify-end gap-2">
        <button
          class="btn border-success text-success hover:[&:not(:disabled)]:bg-success hover:[&:not(:disabled)]:text-inherit focus:[&:not(:disabled)]:bg-success focus:[&:not(:disabled)]:text-inherit"
          type="submit"
          :disabled="isSubmitting || !meta.valid"
        >
          {{ isLogin ? 'Log in' : 'Register' }}
          <IconSpinner v-if="isSubmitting" />
        </button>
      </div>
    </slot>
  </Form>
</template>
