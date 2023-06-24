<script setup>
  import { IconInfoCircle } from '@tabler/icons-vue';
  import { useField } from 'vee-validate';
  import { computed, ref, toRef } from 'vue';
  import { useTippy } from 'vue-tippy';

  const infoTag = ref(null);

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
    isRequired: {
      type: Boolean,
      default: true,
    },
    infoTagMsg: String,
  });

  const name = toRef(props, 'id');

  useTippy(infoTag, {
    content: props.infoTagMsg,
    placement: 'right',
  });
  defineEmits(['update:modelValue']);

  const {
    value: inputValue,
    errorMessage,
    handleBlur,
    handleChange,
  } = useField(name, undefined, {
    initialValue: '',
  });

  const placeholder = props.placeholder ?? `enter your ${props.type}`;
  const errorId = computed(() => `${props.id}-error`);
  const labelClass = computed(() => ({
    'form-field__label': true,
    'sr-only': props.hideLabel,
  }));
</script>

<template>
  <div class="form-field">
    <label class="form-field__label" :for="id">
      {{ props.label }}
      <span v-if="props.isRequired" class="ml-1 text-accent">*</span>
      <IconInfoCircle
        v-if="props.infoTagMsg"
        class="ml-1 h-4 w-4"
        ref="infoTag"
        aria-label="Information"
      />
    </label>
    <label :class="labelClass" :for="id">{{ label }}</label>
    <input
      :value="inputValue"
      :type="props.type"
      :placeholder="placeholder"
      :required="props.isRequired"
      class="form-field__input"
      :name="id"
      :id="id"
      :type="type"
      :required="isRequired"
      :aria-invalid="isInvalid"
      :aria-errormessage="errorId"
      @input="handleChange"
      @blur="handleBlur"
    />
    <p v-show="!!errorMessage" :id="errorId" class="form-field__error">
      {{ errorMessage }}
    </p>
  </div>
</template>
