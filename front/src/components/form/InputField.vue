<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    errorMsg: String,
    hideLabel: Boolean,
    describedBy: String,
    modelValue: [String, Number],
  });
  defineEmits(['update:modelValue']);

  const errorId = computed(() => `${props.id}-error`);
  const labelClass = computed(() => ({
    'form-field__label': true,
    'sr-only': props.hideLabel,
  }));
</script>

<template>
  <div class="form-field">
    <label :class="labelClass" :for="id">{{ label }}</label>
    <input
      class="form-field__input"
      :id="id"
      :type="type"
      :required="isRequired"
      :aria-invalid="isInvalid"
      :aria-errormessage="errorId"
      :aria-describedby="describedBy"
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="isInvalid && errorMsg" :id="errorId" class="form-field__error">
      {{ errorMsg }}
    </p>
  </div>
</template>
