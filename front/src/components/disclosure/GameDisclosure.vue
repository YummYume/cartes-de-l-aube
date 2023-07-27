<script setup>
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
  import { IconHeart, IconChevronDown, IconShield, IconSword } from '@tabler/icons-vue';

  import IconDeploymentCost from '../icon/IconDeploymentCost.vue';
</script>

<template>
  <div class="disclosure">
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
            (operators) at most and can deploy at most 4 at once. Each card has a cost and a rarity.
            Stronger cards will cost you more sanity to deploy. To win, you must defeat all of your
            opponent's cards or bring their health to 0.
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
                  <code class="rounded-md bg-primary px-1 py-0.5"
                    >(defense - attack) / attack * 100</code
                  >. Defense cannot reduce more than 75% of the damage received.
                </span>
              </span>
            </li>
            <li>
              <span>
                <IconHeart class="mr-1 mt-0.5 inline-block h-5 w-5 fill-slate-50 align-text-top" />
                <strong>Health</strong>
                <span
                  >: The amount of damage a card can take before dying. When a card's health reaches
                  0, it dies. Players also have health. When a player's health reaches 0, they lose
                  the game.
                </span>
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
        <span class="disclosure__button-text">What happens if I win/lose?</span>
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
            If you win, you will get 300 orundum and 20 leaderboard points. If you lose, you will
            get 50 orundum and lose 20 leaderboard points. If a draw happens, for example if both
            players disconnect, they will both lose 10 leaderboard points.
          </p>
        </DisclosurePanel>
      </transition>
    </Disclosure>
  </div>
</template>
