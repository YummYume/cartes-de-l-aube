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
    v-slot="{ isSubmitting, meta }"
  >
    <InputField
      id="username"
      name="username"
      class="mb-5"
      label="Username"
      type="text"
      placeholder="Enter your username"
      :infoTagMsg="isLogin ? null : 'Your username must contain 3 to 15 characters.'"
      :is-required="true"
    />
    <InputField
      id="password"
      name="password"
      class="mb-5"
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
      class="mb-5"
      label="Confirm password"
      type="password"
      placeholder="Confirm your password"
      :is-required="true"
    />
    <div class="flex justify-end">
      <button
        class="btn mr-2 border-success text-success hover:[&:not(:disabled)]:bg-success hover:[&:not(:disabled)]:text-inherit focus:[&:not(:disabled)]:bg-success focus:[&:not(:disabled)]:text-inherit"
        type="submit"
        :disabled="isSubmitting || !meta.valid"
      >
        {{ !isSubmitting ? (isLogin ? 'Log in' : 'Register') : '' }}
        <IconSpinner v-if="isSubmitting" />
      </button>
      <slot v-if="!isSubmitting"></slot>
    </div>
  </Form>
</template>
