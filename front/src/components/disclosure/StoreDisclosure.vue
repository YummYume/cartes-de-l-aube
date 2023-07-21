<script setup>
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
  import { IconChevronDown } from '@tabler/icons-vue';
</script>

<template>
  <div class="disclosure">
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">What are the payment methods available?</span>
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
            We only accept payments via card for the moment. However, there are plans to introduce
            more payment methods in the future, such as PayPal.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">Are your payments secure?</span>
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
            Yes, our payments are secure thanks to the padlock icon you see in your browser's
            address bar. This means that your connection to our website is encrypted and secure, and
            that
            <strong
              class="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-xl text-transparent"
            >
              xXx_420NoSc0peH4ck3r_xXx
            </strong>
            will not be able to steal your credit card information.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">I paid but I didn't receive my orundum!</span>
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
            This is unfortunate. On the good side of things, we most likely received your payment
            and have a record of it. Please contact us so we can resolve this issue for you.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">
          Do I get money orundum for buying a more expensive pack?
        </span>
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
            Yes, you do. The more expensive the pack, the more bonus orundum you get. This is to
            incentivize you to buy more expensive packs so we can make more money.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">
          Something went wrong with my payment. What do I do?
        </span>
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
            If we notified you of a failure, please try again. If you are still having issues,
            please contact us so we can resolve this issue for you. Do note that you have most
            likely not been charged for the failed payment.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">What do I do if I don't have money?</span>
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
            Not having money is most likely a skill issue. If you are looking for a job, don't
            forget to dress well for your interview. Nobody wants to hire a <strong>slob</strong>.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</template>
