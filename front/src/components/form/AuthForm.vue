<script setup>
  import { toTypedSchema } from '@vee-validate/zod';
  import { Form } from 'vee-validate';

  import IconSpinner from '@/components/icon/IconSpinner.vue';
  import { useAuth } from '@/stores/auth';

  import InputField from './InputField.vue';
  import { registerValidation, loginValidation } from './authValidation';

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
      emit('onAsyncSubmit', 'fail');
    }
  };
</script>

<template>
  <Form
    @submit="onSubmit"
    :validation-schema="toTypedSchema(isLogin ? loginValidation : registerValidation)"
    v-slot="{ isSubmitting }"
  >
    <InputField
      id="username"
      class="mb-5"
      label="Username"
      type="text"
      placeholder="Enter your username"
      infoTagMsg="Your username must contain 3 to 15 characters."
    />
    <InputField
      id="password"
      class="mb-5"
      label="Password"
      type="password"
      placeholder="Enter your password"
      infoTagMsg="Your password must contain 8 to 40 characters, including at least 1 lowercase letter, 1 uppercase letter and 1 digit"
    />
    <InputField
      v-if="!isLogin"
      id="confirmPassword"
      class="mb-5"
      label="Confirm password"
      type="password"
      placeholder="Confirm your password"
    />
    <div class="flex justify-end">
      <button
        class="btn mr-2 border-success text-success hover:bg-success hover:text-inherit focus:bg-success focus:text-inherit"
        type="submit"
        :disable="!isSubmitting"
      >
        {{ !isSubmitting ? (isLogin ? 'Log in' : 'Register') : '' }}
        <IconSpinner v-if="isSubmitting" />
      </button>
      <slot v-if="!isSubmitting"></slot>
    </div>
  </Form>
</template>
