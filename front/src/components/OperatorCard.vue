<script setup>
  import { IconHeart, IconSword, IconShield } from '@tabler/icons-vue';
  import { UseImage } from '@vueuse/components';
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
  const operatorCardClass = computed(() => ({
    'operator-card': true,
    'operator-card--active': props.active === null ? cardIsActive.value : props.active,
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
</script>

<template>
  <div
    :class="operatorCardClass"
    :aria-labelledby="operatorNameRef?.id"
    :aria-describedby="operatorDescriptionRef?.id"
    @keydown.enter="() => (cardIsActive = !cardIsActive)"
    @keydown.space.prevent="() => (cardIsActive = !cardIsActive)"
    @click="() => (cardIsActive = !cardIsActive)"
    tabindex="0"
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
      <UseImage
        :src="operatorPictures.E1.link"
        :alt="`${operator.name} ${operatorPictures.E1.name}`"
        class="operator-card__cover-image"
      >
        <template #loading>
          <div class="flex h-full items-center justify-center">
            <IconSpinner
              class="h-12 w-12 fill-slate-200 text-gray-500"
              :label="`Loading ${operatorPictures.E1.name} picture for operator ${operator.name}`"
            />
          </div>
        </template>
        <template #error>
          <div class="flex h-full flex-col items-center justify-center gap-3">
            <IconHumanResourceDepartment class="h-36 w-36 fill-white" />
            <span>
              Unable to load {{ operatorPictures.E1.name }} picture for operator
              {{ operator.name }}.
            </span>
          </div>
        </template>
      </UseImage>
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
    <UseImage
      :src="operatorPictures.E2.link"
      :alt="`${operator.name} ${operatorPictures.E2.name}`"
      class="operator-card__character"
    >
      <template #loading>
        <div class="operator-card__character flex h-full items-center justify-center">
          <IconSpinner
            class="h-12 w-12 fill-slate-200 text-gray-500"
            :label="`Loading ${operatorPictures.E2.name} picture for operator ${operator.name}`"
          />
        </div>
      </template>
      <template #error>
        <div
          class="operator-card__character flex h-full flex-col items-center justify-center gap-3"
        >
          <IconHumanResourceDepartment class="h-36 w-36 fill-white" />
          <span>
            Unable to load {{ operatorPictures.E2.name }} picture for operator {{ operator.name }}.
          </span>
        </div>
      </template>
    </UseImage>
    <p
      v-unique-id="{ prefix: 'operator-description-' }"
      ref="operatorDescriptionRef"
      class="sr-only"
    >
      {{ ariaDescription }}
    </p>
  </div>
</template>
