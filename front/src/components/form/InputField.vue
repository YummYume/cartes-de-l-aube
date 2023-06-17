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
  const errorId = computed(() => `${props.id}-error`);
</script>

<template>
  <div class="form-field">
    <label class="form-field__label" :for="id">{{ props.label }}</label>
    <input
      :type="props.type"
      :placeholder="placeholder"
      :required="props.isRequired"
      class="form-field__input form-field__input--text"
      :id="id"
      :aria-invalid="props.isInvalid"
      :aria-errormessage="errorId"
    />
    <p v-if="props.isInvalid" :id="errorId" class="form-field__error">
      {{ props.errorMsg }}
    </p>
  </div>
</template>
