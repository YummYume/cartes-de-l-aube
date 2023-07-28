import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHasGame = defineStore('has-game', () => {
  const hasGame = ref(false);

  /**
   * @param {boolean} game
   */
  const setHasGame = (game) => {
    hasGame.value = game;
  };

  return { hasGame, setHasGame };
});
