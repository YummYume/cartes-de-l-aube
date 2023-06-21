<script setup>
  import { IconInfoCircle } from '@tabler/icons-vue';
  import { computed, ref } from 'vue';
  import { useTippy } from 'vue-tippy';

  const infoTag = ref(null);

  const props = defineProps({
    modelValue: [String, Number],
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
    isRequired: {
      type: Boolean,
      default: true,
    },
    infoTagMsg: String,
  });

  defineEmits(['update:modelValue']);

  useTippy(infoTag, {
    content: props.infoTagMsg,
    placement: 'right',
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
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="props.type"
      :placeholder="placeholder"
      :required="props.isRequired"
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
