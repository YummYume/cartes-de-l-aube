<script setup>
  import { useMagicKeys } from '@vueuse/core';
  import { watch } from 'vue';

  defineProps({
    isFirstPage: {
      type: Boolean,
      required: true,
    },
    isLastPage: {
      type: Boolean,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    pageCount: {
      type: Number,
      required: true,
    },
  });

  const emit = defineEmits(['navigate', 'prev', 'next']);

  const keys = useMagicKeys();
  const shiftArrowLeft = keys['Shift+ArrowLeft'];
  const shiftArrowRight = keys['Shift+ArrowRight'];

  watch(shiftArrowLeft, (v) => {
    if (v) {
      emit('prev');
    }
  });

  watch(shiftArrowRight, (v) => {
    if (v) {
      emit('next');
    }
  });
</script>

<template>
  <nav v-bind="$attrs">
    <ul class="pagination">
      <li>
        <button
          class="pagination__item"
          type="button"
          aria-keyshortcuts="Shift+ArrowLeft"
          :disabled="isFirstPage"
          @click="$emit('prev')"
        >
          Previous<span class="sr-only"> page</span>
        </button>
      </li>
      <li v-for="item in pageCount" :key="item">
        <button
          :class="`pagination__item ${currentPage === item ? 'pagination__item--active' : ''}`"
          type="button"
          :aria-current="currentPage === item ? 'page' : undefined"
          :disabled="currentPage === item"
          @click="$emit('navigate', item)"
        >
          <span class="sr-only">Go to page </span>{{ item }}
        </button>
      </li>
      <li>
        <button
          class="pagination__item"
          type="button"
          aria-keyshortcuts="Shift+ArrowRight"
          :disabled="isLastPage"
          @click="$emit('next')"
        >
          Next<span class="sr-only"> page</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
