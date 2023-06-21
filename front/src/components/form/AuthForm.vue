<script setup>
  import { reactive } from 'vue';

  import InputField from './InputField.vue';
  import { loginValidation, registerValidation } from './authValidation';

  const form = reactive({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const errors = reactive({
    username: [],
    password: [],
    confirmPassword: [],
  });

  const props = defineProps({
    isLogin: {
      type: Boolean,
      required: true,
    },
  });

  const onSubmit = () => {
    /**
     * type {{ error:  import('zod').ZodError }}
     */
    const { error } = props.isLogin ? loginValidation(form) : registerValidation(form);
    Object.entries(error.format()).forEach(([key, value]) => {
      if (errors[key]) {
        // eslint-disable-next-line no-underscore-dangle
        errors[key] = [...value._errors];
      }
    });
  };
</script>

<template>
  <form @submit.prevent="onSubmit($event)">
    <InputField
      v-model="form.username"
      id="username"
      class="mb-5"
      label="Username"
      type="text"
      placeholder="Enter your username"
      :errorMsg="errors.username"
      infoTagMsg="Your username must contain 3 to 15 characters."
      :isInvalid="errors.username.length > 0"
    />
    <InputField
      v-model="form.password"
      id="password"
      class="mb-5"
      label="Password"
      type="password"
      placeholder="Enter your password"
      :errorMsg="errors.password"
      infoTagMsg="Your password must contain 8 to 40 characters, 1 lowercase, 1 uppercase, 1 digit"
      :isInvalid="errors.password.length > 0"
    />
    <InputField
      v-if="!isLogin"
      v-model="form.confirmPassword"
      id="confirmPassword"
      class="mb-5"
      label="Confirm password"
      type="password"
      placeholder="Confirm your password"
      :errorMsg="errors.confirmPassword"
      :isInvalid="errors.confirmPassword.length > 0"
    />
    <div class="flex justify-end">
      <button
        class="btn mr-2 border-success text-success hover:bg-success hover:text-inherit focus:bg-success focus:text-inherit"
        type="submit"
      >
        {{ isLogin ? 'Log in' : 'Register' }}
      </button>
      <slot></slot>
    </div>
  </form>
</template>
