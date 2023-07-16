<script setup>
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
  import { IconChevronDown } from '@tabler/icons-vue';
</script>

<template>
  <div class="disclosure">
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">What are the odds of getting x operator?</span>
        <IconChevronDown class="h-4 w-4 transition-all duration-300 ui-open:rotate-180" />
      </DisclosureButton>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="disclosure__content">
          <p>
            The odds of getting an operator depends on the rarity of the operator. The higher the
            rarity, the lower the odds. The odds are as follows:
          </p>

          <ul class="mt-4 list-inside list-disc">
            <li><span class="text--senior">6★</span>: 2%</li>
            <li><span class="text--elite">5★</span>: 8%</li>
            <li><span class="text--rare">4★</span>: 30%</li>
            <li><span class="text--common">3★</span>: 60%</li>
          </ul>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">What if I get a duplicate operator?</span>
        <IconChevronDown class="h-4 w-4 transition-all duration-300 ui-open:rotate-180" />
      </DisclosureButton>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="disclosure__content">
          <p>
            If you get a duplicate operator, you will get a percentage of the orundum you spent
            back. The amount of orundum you get back depends on the rarity of the operator. The
            higher the rarity, the more orundum you get back. The amount of orundum you get back is
            as follows:
          </p>

          <ul class="mt-4 list-inside list-disc">
            <li><span class="text--senior">6★</span>: 100% of the amount spent (600 orundum)</li>
            <li><span class="text--elite">5★</span>: 75% of the amount spent (450 orundum)</li>
            <li><span class="text--rare">4★</span>: 50% of the amount spent (300 orundum)</li>
            <li><span class="text--common">3★</span>: 25% of the amount spent (150 orundum)</li>
          </ul>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">How can I view my operator's stats?</span>
        <IconChevronDown class="h-4 w-4 transition-all duration-300 ui-open:rotate-180" />
      </DisclosureButton>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="disclosure__content">
          <p>You can click on your operator's card to toggle stat display on and off.</p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">Are there any discounts?</span>
        <IconChevronDown class="h-4 w-4 transition-all duration-300 ui-open:rotate-180" />
      </DisclosureButton>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="disclosure__content">
          <p>
            No, discounts are not available for the moment. However, there are plans to introduce
            discounts in the future.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">Is there a pity system?</span>
        <IconChevronDown class="h-4 w-4 transition-all duration-300 ui-open:rotate-180" />
      </DisclosureButton>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel class="disclosure__content">
          <p>
            No, there is no pity system available for the moment. However, there are plans to
            introduce a pity system in the future.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</template>
