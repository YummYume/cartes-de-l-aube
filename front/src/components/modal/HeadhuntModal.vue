<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue';

  import BackdropModal from './BackdropModal.vue';

  import OperatorCard from '../OperatorCard.vue';
  import IconOrundum from '../icon/IconOrundum.vue';

  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    /**
     * @type {import('vue').PropType<OperatorPull[]>}
     */
    operators: {
      type: Array,
      required: true,
    },
  });
  const emit = defineEmits(['close']);

  const handleClose = () => {
    emit('close');
  };

  /**
   * @param {OperatorPull} operatorPull
   * @returns {string}
   */
  const getOperatorDescription = (operatorPull) => {
    if (operatorPull.new) {
      return `${operatorPull.operator.name} is a new ${operatorPull.operator.rarity} star operator which has ${operatorPull.operator.statistics.hp} health points, ${operatorPull.operator.statistics.atk} attack, ${operatorPull.operator.statistics.def} defense and costs ${operatorPull.operator.statistics.cost} points to deploy.`;
    }

    return `Because you already have ${operatorPull.operator.name}, you received ${operatorPull.orundum} orundum as compensation.`;
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
                Headhunt Result
              </DialogTitle>
              <DialogDescription class="dialog__panel--description sr-only mt-2">
                Result of your pulls.
              </DialogDescription>

              <section
                class="my-6 mt-10 flex w-full flex-wrap items-center justify-center gap-14 overflow-x-clip"
                @click.self="handleClose"
              >
                <div
                  v-for="(operatorPull, key) in operators"
                  :key="`${operatorPull.operator.name}-${key}`"
                  class="flex flex-col items-center justify-center gap-4"
                >
                  <OperatorCard
                    :operator="operatorPull.operator"
                    :description="getOperatorDescription(operatorPull)"
                  />
                  <span
                    v-if="operatorPull.new"
                    class="animate-bounce text-3xl text-tertiary drop-shadow"
                  >
                    New!
                  </span>
                  <div v-else class="flex items-center justify-center gap-2 text-3xl">
                    <IconOrundum class="h-8 w-8" />
                    <span>+{{ operatorPull.orundum }}</span>
                  </div>
                </div>
              </section>

              <footer class="relative mt-6 text-center text-2xl">
                <button type="button" @click="handleClose">Click anywhere to close</button>
              </footer>
            </DialogPanel>
          </div>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
