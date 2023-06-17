<script setup>
  import InputField from './InputField.vue';
</script>

<template>
  <form>
    <InputField
      id="username"
      class="mb-5"
      label="Username"
      type="text"
      placeholder="Enter your username"
      errorMsg="Please provide your username"
      isInvalid
    />
    <InputField
      id="password"
      label="Password"
      type="'password"
      placeholder="Enter your password"
      errorMsg="Please provide your password"
    />
  </form>
</template>
