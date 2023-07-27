<script setup>
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    DialogDescription,
    TransitionRoot,
    TransitionChild,
    TabGroup,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
  } from '@headlessui/vue';
  import { useMediaQuery } from '@vueuse/core';

  import BackdropModal from './BackdropModal.vue';

  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
  });

  defineEmits(['close']);

  const vertical = useMediaQuery('(max-width: 639px)');
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="$emit('close')" class="dialog">
      <BackdropModal />
      <TransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
        as="template"
      >
        <DialogPanel
          class="dialog__panel max-w-[95vw] bg-slate-700 text-slate-100 sm:max-w-xl lg:max-w-[60vw]"
        >
          <DialogTitle class="dialog__panel--title">About</DialogTitle>
          <DialogDescription class="dialog__panel--description mt-2">
            All the stuff you usually do not read, but should.
          </DialogDescription>

          <section class="dialog__panel--section my-6">
            <TabGroup class="tab" as="div" :vertical="vertical">
              <TabList class="tab__list">
                <Tab class="tab__list-item">Cookie policy</Tab>
                <Tab class="tab__list-item">About us</Tab>
                <Tab class="tab__list-item">Privacy policy</Tab>
                <Tab class="tab__list-item">Terms and conditions</Tab>
              </TabList>
              <TabPanels>
                <TabPanel
                  class="tab__panel-item themed-scrollbar max-h-[50vh] overflow-y-auto overflow-x-hidden"
                >
                  <h2 class="mb-4 text-2xl font-bold">Cookie Policy</h2>
                  <div class="flex flex-col space-y-4">
                    <p>
                      We use cookies to ensure that we give you the best experience on our website.
                      By continuing to use our site, you accept our use of cookies.
                    </p>
                    <div class="rounded-md border border-gray-300 p-4">
                      <h3 class="mb-2 text-lg font-bold">What are cookies?</h3>
                      <p>
                        Cookies are small text files that are placed on your computer or mobile
                        device when you visit a website. They are widely used to make websites work
                        or to work more efficiently, as well as to provide information to the owners
                        of the site.
                      </p>
                    </div>
                    <div class="rounded-md border border-gray-300 p-4">
                      <h3 class="mb-2 text-lg font-bold">What cookies do we use?</h3>
                      <p>
                        We only use one cookie, called "token", for authentication purposes on our
                        website.
                      </p>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel
                  class="tab__panel-item themed-scrollbar max-h-[50vh] overflow-y-auto overflow-x-hidden"
                >
                  <h2 class="mb-4 text-2xl font-bold">About us</h2>

                  <div class="flex flex-col space-y-4">
                    <p>Who and why?</p>
                    <div class="rounded-md border border-gray-300 p-4">
                      <h3 class="mb-2 text-lg font-bold">Why we made this project</h3>
                      <p class="mb-2">
                        This project is the final project for the year, and we wanted to challenge
                        ourselves by creating a game using Vue.js. We believe that Vue.js is a
                        powerful and flexible framework that can be used to create complex and
                        engaging web applications, and we wanted to put our skills to the test by
                        creating a game that would be both fun and challenging to play.
                      </p>
                      <p>
                        We also wanted to create a project that would allow us to showcase our
                        creativity and passion for game development. We believe that games are a
                        powerful medium for storytelling and self-expression, and we wanted to
                        create a game that would be both entertaining and meaningful.
                      </p>
                    </div>
                    <div class="rounded-md border border-gray-300 p-4">
                      <h3 class="mb-2 text-lg font-bold">Why we chose Arknights</h3>
                      <p class="mb-2">
                        We chose Arknights as the theme for our game because we love it! Arknights
                        is a popular mobile tower defense game that has gained a large following
                        around the world. We were drawn to the game's unique art style, engaging
                        gameplay, and compelling storyline, and we wanted to create a game that
                        would capture the essence of what makes Arknights so special.
                      </p>
                      <p>
                        We also wanted to challenge ourselves by creating a game that would require
                        us to think creatively and strategically. Arknights is a game that requires
                        players to think carefully about their tactics and to make strategic
                        decisions in order to succeed, and we wanted to create a game that would be
                        just as challenging and rewarding to play.
                      </p>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel
                  class="tab__panel-item themed-scrollbar max-h-[50vh] overflow-y-auto overflow-x-hidden"
                >
                  <h2 class="mb-4 text-2xl font-bold">Privacy Policy</h2>
                  <div class="flex flex-col space-y-4">
                    <p>
                      We take your privacy seriously. This policy describes what personal
                      information we collect and how we use it.
                    </p>
                    <div class="rounded-md border border-gray-300 p-4">
                      <h3 class="mb-2 text-lg font-bold">What information do we collect?</h3>
                      <p>
                        We don't collect any personal information about you. We don't sell your
                        information to anyone either. Frankly, we don't care about your information.
                      </p>
                    </div>
                    <div class="rounded-md border border-gray-300 p-4">
                      <h3 class="mb-2 text-lg font-bold">How do we use your information?</h3>
                      <p>
                        Pretty simple, we don't. We don't use your information for anything. We
                        don't even store it. We don't even know who you are. We don't care.
                      </p>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel
                  class="tab__panel-item themed-scrollbar max-h-[50vh] overflow-y-auto overflow-x-hidden"
                >
                  <h2 class="mb-4 text-2xl font-bold">Terms and Conditions</h2>
                  <div class="flex flex-col space-y-4">
                    <p>
                      By using our service, you agree to these terms and conditions. If you do not
                      agree to these terms and conditions, you may not use our service.
                    </p>
                    <div class="rounded-md border border-gray-300 p-4">
                      <h3 class="mb-2 text-lg font-bold">Intellectual Property</h3>
                      <p>
                        All content on our website, including but not limited to text, graphics,
                        logos, images, and software, is our property and is protected by
                        international copyright laws... Except everything that is not ours. Such as
                        the Arknights logo, images, and software.
                      </p>
                    </div>
                    <div class="rounded-md border border-gray-300 p-4">
                      <h3 class="mb-2 text-lg font-bold">Limitation of Liability</h3>
                      <p>
                        We shall not be liable for any direct, indirect, incidental, special, or
                        consequential damages arising out of or in connection with the use or
                        inability to use our service.
                      </p>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </section>

          <footer class="dialog__panel--actions mt-6">
            <button
              class="btn border-accent text-accent hover:bg-accent hover:text-inherit focus:bg-accent focus:text-inherit"
              @click="$emit('close')"
            >
              Close
            </button>
          </footer>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
