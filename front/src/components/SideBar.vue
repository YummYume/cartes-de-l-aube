<script setup>
  import { IconLock, IconLockOpen } from '@tabler/icons-vue';
  import { onClickOutside, useActiveElement, useElementHover } from '@vueuse/core';
  import { ref, onMounted, onBeforeUnmount, computed, watch, toRefs } from 'vue';

  /**
   * @typedef {{ icon: import('@tabler/icons-vue').IconComponent; label: string; to?: string; onClick?: (event: Event) => void; active?: boolean; }} SidebarItem
   */

  /**
   * @type {defineProps<{ sidebarItems: SidebarItem[] }>} props
   */
  const props = defineProps({
    items: {
      type: Array,
      default: () => [],
    },
  });

  const { items: sidebarItems } = toRefs(props);
  const activeElement = useActiveElement();
  const isHovered = ref(false);
  const isLocked = ref(false);
  /**
   * @type {import('vue').Ref<HTMLElement | null>} asideRoot
   */
  const asideRoot = ref(null);
  const asideRootHovered = useElementHover(asideRoot);
  const isMobile = ref(false);
  const itemClass =
    'flex items-center gap-2 transition-all duration-200 ease-in-out hover:scale-110 focus-visible:scale-110 h-8';

  const isExpanded = computed(() => {
    return (isHovered.value || isLocked.value) && !isMobile.value;
  });

  const activeSidebarItems = computed(() => {
    return sidebarItems.value.filter((item) => item.active ?? true);
  });

  const sidebarClasses = computed(() => ({
    // Desktop classes
    'p-2': !isMobile.value,
    'h-full': !isMobile.value,
    'border-l': !isMobile.value,
    'min-w-[180px]': isExpanded.value,
    'min-w-[80px]': !isExpanded.value,
    // Mobile classes
    'sticky': isMobile.value,
    'mt-auto': isMobile.value,
    'w-full': isMobile.value,
    'h-auto': isMobile.value,
    'py-3': isMobile.value,
    'px-1': isMobile.value,
    'border-t': isMobile.value,
    // Shared classes
    'flex': true,
    'flex-col': true,
    'justify-between': true,
    'overflow-y-auto': true,
    'overflow-x-hidden': true,
    'border-surface/30': true,
    'bg-primary': true,
    'shadow-md': true,
    'lg:w-auto': true,
    'transition-all': true,
    'duration-300': true,
    'ease-in-out': true,
  }));

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768;
  };

  /**
   * @param {HTMLElement} el
   * @param {() => void} done
   */
  const onLinkEnter = (el, done) => {
    const elWidth = `${el.scrollWidth}px`;
    const animation = el.animate([{ width: '0px' }, { width: elWidth }], {
      duration: 150,
      easing: 'ease-in-out',
    });

    animation.onfinish = () => {
      el.style.width = elWidth;
      done();
    };
    animation.oncancel = () => {
      el.style.width = '0px';
      done();
    };
  };

  /**
   * @param {HTMLElement} el
   * @param {() => void} done
   */
  const onLinkLeave = (el, done) => {
    const elWidth = `${el.scrollWidth}px`;
    const animation = el.animate([{ width: elWidth }, { width: '0px' }], {
      duration: 150,
      easing: 'ease-in-out',
    });

    animation.onfinish = () => {
      el.style.width = '0px';
      done();
    };
    animation.oncancel = () => {
      el.style.width = elWidth;
      done();
    };
  };

  /**
   * @param {HTMLElement} el
   * @param {() => void} done
   */
  const onElementEnter = (el, done) => {
    const animation = el.animate([{ opacity: '0' }, { opacity: '1' }], {
      duration: 150,
      easing: 'ease-in-out',
      delay: 150,
    });

    animation.onfinish = () => {
      el.style.opacity = '1';
      done();
    };
    animation.oncancel = () => {
      el.style.opacity = '0';
      done();
    };
  };

  /**
   * @param {HTMLElement} el
   * @param {() => void} done
   */
  const onElementLeave = (el, done) => {
    el.style.opacity = '0';
    done();
  };

  watch(activeElement, (el) => {
    if (asideRoot.value && asideRoot.value.contains(el)) {
      isHovered.value = true;
    } else if (!asideRootHovered.value) {
      isHovered.value = false;
    }
  });

  onClickOutside(asideRoot, () => {
    if (isExpanded.value && !isLocked.value) {
      isHovered.value = false;
    }
  });

  onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
  });
</script>

<template>
  <aside
    :class="sidebarClasses"
    ref="asideRoot"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :aria-expanded="isExpanded"
  >
    <button
      :aria-label="isLocked ? 'Unlock the sidebar' : 'Lock the sidebar open'"
      type="button"
      @click="isLocked = !isLocked"
      class="self-end"
      v-show="isExpanded"
    >
      <IconLock v-if="isLocked" class="h-6 w-6" />
      <IconLockOpen v-else class="h-6 w-6" />
    </button>
    <nav class="flex grow flex-col items-center justify-center">
      <ol class="flex flex-row flex-wrap justify-center gap-4 md:flex-col">
        <li v-for="item in activeSidebarItems" :key="item.label">
          <RouterLink
            :to="item.to"
            :class="itemClass"
            exact-active-class="text-secondary"
            v-if="item.to"
          >
            <component v-bind:is="item.icon" class="h-6 w-6" />
            <Transition @enter="onLinkEnter" @leave="onLinkLeave" :css="false">
              <span v-show="isExpanded" class="w-0">{{ item.label }}</span>
            </Transition>
          </RouterLink>
          <button type="button" @click="item.onClick" v-else-if="item.onClick" :class="itemClass">
            <component v-bind:is="item.icon" class="h-6 w-6" />
            <Transition @enter="onLinkEnter" @leave="onLinkLeave" :css="false">
              <span v-show="isExpanded" class="w-0">{{ item.label }}</span>
            </Transition>
          </button>
        </li>
      </ol>
    </nav>
    <Transition @enter="onElementEnter" @leave="onElementLeave" :css="false">
      <small class="self-center text-center" v-show="isExpanded">1.0 Beta</small>
    </Transition>
  </aside>
</template>
