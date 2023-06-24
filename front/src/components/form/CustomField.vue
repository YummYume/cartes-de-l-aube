<script setup>
  import { Field } from 'vee-validate';

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
    placeholder: String,
    errorMsg: {
      type: Array,
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
    infoTagMsg: String,
  });
</script>
<template>
  <Field
    :type="props.type"
    name="password"
    class="form-field__input"
    :value="modelValue"
    :placeholder="placeholder"
    v-slot="{ field }"
    @input="$emit('update:modelValue', $event.target.value)"
    :id="id"
    :required="props.isRequired"
    :aria-errormessage="errorId"
    :aria-invalid="props.isInvalid"
  >
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
      <input v-bind="field" />
      <ul v-if="props.isInvalid" :id="errorId" class="form-field__error">
        <li v-for="(msg, index) in props.errorMsg" :key="`${index}-${msg}`">{{ msg }}</li>
      </ul>
    </div>
  </Field>
</template>
