<script setup>
  import { IconHeart, IconSword, IconShield } from '@tabler/icons-vue';
  import { vIntersectionObserver } from '@vueuse/components';
  import { useImage } from '@vueuse/core';
  import { computed, ref } from 'vue';

  import {
    getOperatorBackground,
    getOperatorPicture,
    getOperatorClass,
  } from '@/utils/operator-picture';

  import IconDeploymentCost from './icon/IconDeploymentCost.vue';
  import IconHumanResourceDepartment from './icon/IconHumanResourceDepartment.vue';
  import IconSpinner from './icon/IconSpinner.vue';

  const props = defineProps({
    /**
     * @type {import('vue').PropType<Operator>}
     */
    operator: {
      type: Object,
      required: true,
    },
    withHighlight: {
      type: Boolean,
      default: true,
    },
    active: {
      default: null,
      required: false,
      validator: (value) => typeof value === 'boolean' || value === null,
    },
    description: {
      type: String,
      required: false,
    },
  });

  const emit = defineEmits(['select']);

  const operatorPictures = computed(() => ({
    E1: getOperatorPicture(props.operator, ['E1', 'base']),
    E2: getOperatorPicture(props.operator, ['E2', 'E1', 'base']),
    bg: getOperatorBackground(props.operator),
    class: getOperatorClass(props.operator),
  }));
  /**
   * @type {import('vue').Ref<HTMLElement>|null}
   */
  const operatorNameRef = ref(null);
  /**
   * @type {import('vue').Ref<HTMLElement>|null}
   */
  const operatorDescriptionRef = ref(null);
  const cardIsActive = ref(false);
  const intersected = ref(false);
  const {
    execute: loadE1Picture,
    isLoading: e1PictureLoading,
    isReady: e1PictureReady,
  } = useImage(
    {
      src: operatorPictures.value.E1.link,
    },
    {
      immediate: false,
      throwError: false,
    }
  );
  const {
    execute: loadE2Picture,
    isLoading: e2PictureLoading,
    isReady: e2PictureReady,
  } = useImage(
    {
      src: operatorPictures.value.E2.link,
    },
    {
      immediate: false,
      throwError: false,
    }
  );
  const isActive = computed(() => (props.active === null ? cardIsActive.value : props.active));
  const operatorCardClass = computed(() => ({
    'operator-card': true,
    'operator-card--active': isActive.value,
    'cursor-pointer': props.active === null,
  }));
  const wrapperClass = computed(() => ({
    'operator-card__wrapper': true,
    'operator-card__wrapper--highlight-common': props.withHighlight && props.operator.rarity === 3,
    'operator-card__wrapper--highlight-rare': props.withHighlight && props.operator.rarity === 4,
    'operator-card__wrapper--highlight-elite': props.withHighlight && props.operator.rarity === 5,
    'operator-card__wrapper--highlight-senior': props.withHighlight && props.operator.rarity === 6,
  }));
  const ariaDescription = computed(() => {
    if (props.description) {
      return props.description;
    }

    return `${props.operator.name} is a ${props.operator.rarity} stars operator with ${props.operator.statistics.hp} health points, ${props.operator.statistics.atk} attack, ${props.operator.statistics.def} defense and costs ${props.operator.statistics.cost} points to deploy.`;
  });

  const handleSelect = () => {
    cardIsActive.value = !cardIsActive.value;

    emit('select', props.operator);
  };

  /**
   * @param {IntersectionObserverEntry[]} entries
   * @param {IntersectionObserver} observer
   */
  const loadPictures = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        intersected.value = true;

        loadE1Picture();
        loadE2Picture();

        observer.unobserve(entry.target);
      }
    });
  };
</script>

<template>
  <div
    :class="operatorCardClass"
    :aria-labelledby="operatorNameRef?.id"
    :aria-describedby="operatorDescriptionRef?.id"
    @keydown.enter="() => handleSelect()"
    @keydown.space.prevent="() => handleSelect()"
    @click="() => handleSelect()"
    tabindex="0"
    role="button"
    v-intersection-observer="[loadPictures, { threshold: 0.1 }]"
    v-bind="$attrs"
  >
    <div aria-hidden="true" :class="wrapperClass">
      <div v-if="operatorPictures.class" class="operator-card__class-icon">
        <component :is="operatorPictures.class" class="h-8 w-8 fill-slate-50" />
      </div>
      <img
        :src="operatorPictures.bg"
        :alt="`Background picture for operator ${operator.name} with rarity ${operator.rarity}`"
        class="operator-card__background-image"
      />
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        mode="out-in"
      >
        <img
          :src="operatorPictures.E1.link"
          :alt="`${operator.name} ${operatorPictures.E1.name}`"
          class="operator-card__cover-image"
          v-if="e1PictureReady"
        />
        <div
          class="flex h-full items-center justify-center"
          v-else-if="e1PictureLoading || !intersected"
        >
          <IconSpinner
            class="h-12 w-12 fill-slate-200 text-gray-500"
            :label="`Loading ${operatorPictures.E1.name} picture for operator ${operator.name}`"
          />
        </div>
        <div
          class="flex h-full flex-col items-center justify-start gap-3 text-center text-primary"
          v-else
        >
          <IconHumanResourceDepartment class="h-36 w-36 fill-primary" />
          <span>
            Unable to load {{ operatorPictures.E1.name }} picture for operator {{ operator.name }}.
          </span>
        </div>
      </Transition>
    </div>
    <div class="operator-card__info">
      <span
        v-unique-id="{ prefix: 'operator-name-' }"
        ref="operatorNameRef"
        class="operator-card__title"
      >
        {{ operator.name }}
      </span>
      <div aria-hidden="true" class="operator-card__stats">
        <div class="operator-card__stat operator-card__stat--cost">
          <span>{{ operator.statistics.cost }}</span>
          <IconDeploymentCost class="h-4 w-4 fill-white" />
        </div>
        <div class="operator-card__stat">
          <span>{{ operator.statistics.hp }}</span>
          <IconHeart class="h-4 w-4" />
        </div>
        <div class="operator-card__stat">
          <span>{{ operator.statistics.atk }}</span>
          <IconSword class="h-4 w-4" />
        </div>
        <div class="operator-card__stat">
          <span>{{ operator.statistics.def }}</span>
          <IconShield class="h-4 w-4" />
        </div>
      </div>
    </div>
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      :enter-to-class="isActive ? 'opacity-100' : 'opacity-0'"
      leave-active-class="transition-opacity duration-300"
      :leave-from-class="isActive ? 'opacity-100' : 'opacity-0'"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <img
        :src="operatorPictures.E2.link"
        :alt="`${operator.name} ${operatorPictures.E2.name}`"
        class="operator-card__character"
        v-if="e2PictureReady"
      />
      <div
        class="operator-card__character flex h-full items-center justify-center"
        v-else-if="e2PictureLoading || !intersected"
      >
        <IconSpinner
          class="h-12 w-12 fill-slate-200 text-gray-500"
          :label="`Loading ${operatorPictures.E2.name} picture for operator ${operator.name}`"
        />
      </div>
      <div
        class="operator-card__character flex h-full max-h-[18.75rem] flex-col items-center justify-center gap-3 text-center"
        v-else
      >
        <IconHumanResourceDepartment class="h-36 w-36 fill-white" />
        <span>
          Unable to load {{ operatorPictures.E2.name }} picture for operator {{ operator.name }}.
        </span>
      </div>
    </Transition>
    <p
      v-unique-id="{ prefix: 'operator-description-' }"
      ref="operatorDescriptionRef"
      class="sr-only"
    >
      {{ ariaDescription }}
    </p>
  </div>
</template>
