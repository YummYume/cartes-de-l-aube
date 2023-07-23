<script setup>
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
  import { IconHeart, IconShield, IconSword, IconChevronDown } from '@tabler/icons-vue';

  import IconDeploymentCost from '@/components/icon/IconDeploymentCost.vue';

  defineProps({
    /**
     * @type {import('vue').PropType<User>}
     */
    user: {
      default: null,
      validator: (value) => typeof value === 'object' || value === null,
    },
  });
</script>

<template>
  <div class="disclosure">
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">What kind of game is Cartes de l'aube?</span>
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
            Cartes de l'aube is a card game based on the popular mobile game
            <a
              href="https://www.arknights.global/"
              target="_blank"
              rel="noopener"
              class="link text-accent"
              >Arknights</a
            >. It is a multiplayer game where you fight against other players using cards from the
            Arknights universe.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">Why did you choose this name?</span>
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
            Cartes de l'aube is the French for "cards of dawn". We chose this name because we wanted
            to refer to the Arknights universe while also referring
            <a href="https://vuejs.org/" target="_blank" rel="noopener" class="link text-accent"
              >Vue.js</a
            >, the framework we used to create this game. Vue.js is pronounced like the French word
            "vue" which means "sight" or "view".
          </p>
          <p>
            <a href="https://vitejs.dev/" target="_blank" rel="noopener" class="link text-accent"
              >Vite</a
            >, the bundler we used, is also pronounced like the French word "vite" which means
            "quickly". We thought it would be fun to have a French name for our game. Thanks
            <a
              href="https://github.com/yyx990803"
              target="_blank"
              rel="noopener"
              class="link text-accent"
              >Evan You</a
            >
            for creating Vue.js, Vite, and for the inspiration!
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">How do I get more cards in Cartes de l'aube?</span>
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
            You can get more cards by buying Orundum from the
            <RouterLink v-if="user" class="link text-accent" to="/store">store</RouterLink>
            <span v-else>store</span> and using it to buy card packs.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">Do I have to pay to get Orundum?</span>
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
            No, you don't. You can get Orundum by simply playing the game. You will earn more
            Orundum by winning games than by losing games.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">Why does Cartes de l'aube exist?</span>
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
            Cartes de l'aube was created as a school final project for a
            <a href="https://vuejs.org/" target="_blank" rel="noopener" class="link text-accent"
              >Vue.js</a
            >
            course. It is not affiliated with Hypergryph or Yostar in any way and is not intended to
            be a commercial product.
          </p>
          <p>
            We only use assets from Arknights to not have to create our own. We also do not
            recommend anyone to buy Orundum from our store. If you search hard enough, you may find
            a way to get Orundum for free.
          </p>
          <p>
            If you want to know more about this project and see its source code, please visit our
            <a
              href="https://github.com/YummYume/cartes-de-l-aube"
              target="_blank"
              rel="noopener"
              class="link text-accent"
              >GitHub repository</a
            >. The README should contain everything you need to know.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">How do I play this game?</span>
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
            Cartes de l'aube is a turn based card game. Each player has a deck (squad) of 10 cards
            (operators) at most and a hand of 5 cards. Each card has a cost and a rarity. Stronger
            cards will cost you more sanity to deploy. To win, you must defeat all of your
            opponent's cards.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">What are the different stats used for?</span>
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
            We use different stats to make the game more interesting and dynamic while still
            refering to the original game. The stats are as follows:
          </p>

          <ul class="mt-4 list-inside list-disc">
            <li>
              <span>
                <IconSword class="mr-1 mt-0.5 inline-block h-5 w-5 fill-slate-50 align-text-top" />
                <strong>Attack</strong>
                <span>: The amount of damage a card deals when attacking.</span>
              </span>
            </li>
            <li>
              <span>
                <IconShield class="mr-1 mt-0.5 inline-block h-5 w-5 fill-slate-50 align-text-top" />
                <strong>Defense</strong>
                <span
                  >: The amount of damage a card can block when getting attacked. The damage
                  received is calculated as
                  <code class="rounded-md bg-primary px-1 py-0.5">attack - defense</code>.</span
                >
              </span>
            </li>
            <li>
              <span>
                <IconHeart class="mr-1 mt-0.5 inline-block h-5 w-5 fill-slate-50 align-text-top" />
                <strong>Health</strong>
                <span
                  >: The amount of damage a card can take before dying. When a card's health reaches
                  0, it dies.</span
                >
              </span>
            </li>
            <li>
              <span>
                <IconDeploymentCost
                  class="mr-1 mt-0.5 inline-block h-5 w-5 fill-slate-50 align-text-top"
                />
                <strong>Cost</strong>
                <span
                  >: The amount of sanity you need to deploy a card. You start with 10 sanity and
                  gain 1 sanity each turn. You can have a maximum of 10 sanity at once.</span
                >
              </span>
            </li>
          </ul>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">Is this game balanced?</span>
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
            No, it is not. We did not have enough time to balance the game. We also did not have
            enough time to implement all the features we wanted to implement. We are sorry for the
            inconvenience, you can blame the short deadline for this. Of course, we still tried our
            best to make the game as balanced and fun as possible.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
    <Disclosure>
      <DisclosureButton class="disclosure__button">
        <span class="disclosure__button-text">I cannot see any play button?</span>
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
          <p v-if="!user">
            You need to create an account and log in to be able to play the game. Note that you also
            need to have at least one card in your deck to be able to play.
          </p>
          <p v-else>
            You need to have at least one card in your deck to be able to play. You can manage your
            squad <RouterLink class="link text-accent" to="/squad">here</RouterLink>.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</template>
