<script setup>
  import { IconInfoCircle } from '@tabler/icons-vue';
  import { useField } from 'vee-validate';
  import { computed, ref, toRef, watch } from 'vue';
  import { useTippy } from 'vue-tippy';

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
    hideLabel: {
      type: Boolean,
      default: false,
    },
    infoTagMsg: String,
  });

  /**
   * @type {import('vue').Ref<HTMLElement>}
   */
  const infoTag = ref(null);
  /**
   * @type {import('vue').Ref<HTMLElement>}
   */
  const infoField = ref(null);
  const name = toRef(props, 'id');
  const hasLabelTooltip = computed(() => props.infoTagMsg && !props.hideLabel);
  const triggerTarget = computed(() => {
    const targets = [];

    if (infoTag.value) {
      targets.push(infoTag.value);
    }

    if (infoField.value) {
      targets.push(infoField.value);
    }

    return targets.length === 0 ? null : targets;
  });

  const tooltip = useTippy(hasLabelTooltip.value ? infoTag : infoField, {
    content: props.infoTagMsg,
    placement: 'top-start',
    triggerTarget,
    trigger: 'focus',
    hideOnClick: false,
  });

  const {
    value: inputValue,
    errorMessage,
    handleBlur,
    handleChange,
    meta,
  } = useField(name, undefined, {
    initialValue: '',
  });

  const placeholder = props.placeholder ?? `Enter your ${props.type}`;
  const errorId = computed(() => `${props.id}-error`);
  const isInvalid = computed(() => !meta.valid && !!errorMessage && meta.touched);
  const labelClass = computed(() => ({
    'form-field__label': true,
    'sr-only': props.hideLabel,
  }));

  // Refresh the tooltip when the error message changes
  watch(errorMessage, () => {
    tooltip.refresh();
  });
</script>

<template>
  <div class="form-field">
    <label :class="labelClass" :for="props.id">
      {{ props.label }}
      <span v-if="props.isRequired" class="ml-1 text-accent">*</span>
      <IconInfoCircle
        v-if="hasLabelTooltip"
        class="ml-1 h-4 w-4"
        ref="infoTag"
        aria-label="Information about this field"
        @mouseenter="tooltip.show"
        @mouseleave="tooltip.hide"
      />
    </label>
    <input
      :value="inputValue"
      :type="props.type"
      :placeholder="placeholder"
      :required="props.isRequired"
      class="form-field__input"
      ref="infoField"
      :name="props.id"
      :id="props.id"
      :aria-invalid="isInvalid"
      :aria-errormessage="errorId"
      @input="handleChange"
      @blur="handleBlur"
    />
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <p v-show="isInvalid" :id="errorId" class="form-field__error">
        {{ errorMessage }}
      </p>
    </Transition>
  </div>
</template>
