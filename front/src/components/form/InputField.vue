<script setup>
  const props = defineProps({
    type: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: String,
    errorMsg: {
      type: String,
      required: true,
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
  });

  const placeholder = props.placeholder ?? `enter your ${props.type}`;
</script>

<template>
  <label class="block">
    <span class="block">{{ props.label }}</span>
    <input
      :type="props.type"
      :class="['w-full p-2 text-black placeholder:normal-case']"
      :placeholder="placeholder"
      :required="props.isRequired"
      aria-invalid
      aria-errormessage
    />
    <p v-if="props.isInvalid" class="mt-2 text-pink-600">
      {{ props.errorMsg }}
    </p>
  </label>
</template>
