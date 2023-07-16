<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue';
  import { useOffsetPagination } from '@vueuse/core';
  import { computed } from 'vue';

  import BackdropModal from './BackdropModal.vue';

  import OperatorCard from '../OperatorCard.vue';
  import PaginationNavigation from '../PaginationNavigation.vue';

  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    /**
     * @type {import('vue').PropType<Operator[]>}
     */
    operators: {
      type: Array,
      required: true,
    },
    /**
     * @type {import('vue').PropType<Operator|null>}
     */
    toReplace: {
      default: null,
      required: false,
      validator: (value) => typeof value === 'object' || value === null,
    },
    active: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['close', 'select', 'remove']);

  const { currentPage, currentPageSize, pageCount, isFirstPage, isLastPage, prev, next } =
    useOffsetPagination({
      total: props.operators.length,
      page: 1,
      pageSize: 10,
    });
  const availableOperators = computed(() => {
    const start = (currentPage.value - 1) * currentPageSize.value;
    const end = start + currentPageSize.value;

    return props.operators.slice(start, end);
  });

  const handleClose = () => {
    emit('close');
  };

  /**
   * @param {Operator} operator
   * @param {Operator|null} toReplace
   */
  const handleSelect = (operator, toReplace = null) => {
    emit('select', operator, toReplace);
  };

  /**
   * @param {Operator} operator
   */
  const handleRemove = (operator) => {
    emit('remove', operator);
  };
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="handleClose" class="dialog p-6">
      <BackdropModal background-class="bg-black/70" />
      <TransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
        as="template"
      >
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              class="flex w-screen flex-col items-center justify-center overflow-y-auto py-6"
              @click.self="handleClose"
            >
              <DialogTitle class="dialog__panel--title relative text-5xl">
                Select an operator
              </DialogTitle>

              <DialogDescription class="dialog__panel--description mb-6 mt-2">
                {{
                  toReplace
                    ? `Choose an operator to replace ${toReplace.name}.`
                    : 'Choose an operator to add to your squad.'
                }}
              </DialogDescription>

              <button
                class="mb-2 rounded-xl border-2 border-accent bg-accent/40 p-1.5 transition-all hover:bg-accent/60"
                type="button"
                v-if="toReplace"
                @click="() => handleRemove(toReplace)"
              >
                Remove {{ toReplace.name }}
              </button>

              <section
                class="my-6 flex w-full flex-wrap items-center justify-center gap-14 overflow-x-clip"
                @click.self="handleClose"
              >
                <div
                  v-for="(operator, key) in availableOperators"
                  :key="`${operator.name}-${key}`"
                  class="flex flex-col items-center justify-center gap-4"
                >
                  <OperatorCard
                    :operator="operator"
                    :active="active"
                    :description="`Click to select ${operator.name}${
                      toReplace ? ` and replace ${toReplace.name}.` : '.'
                    } ${operator.name} is a ${operator.rarity} stars operator with ${
                      operator.statistics.hp
                    } health points, ${operator.statistics.atk} attack, ${
                      operator.statistics.def
                    } defense and costs ${operator.statistics.cost} points to deploy.`"
                    @select="() => handleSelect(operator, toReplace)"
                  />
                </div>
              </section>

              <PaginationNavigation
                class="my-6"
                :isFirstPage="isFirstPage"
                :isLastPage="isLastPage"
                :currentPage="currentPage"
                :pageCount="pageCount"
                @navigate="(page) => (currentPage = page)"
                @prev="prev"
                @next="next"
              />

              <footer class="relative mt-6 text-center text-2xl">
                <button aria-label="Click to close" type="button" @click="handleClose">
                  Click anywhere outside to close
                </button>
              </footer>
            </DialogPanel>
          </div>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
