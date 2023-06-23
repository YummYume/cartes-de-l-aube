import IconCaster from '@/components/icon/IconCaster.vue';
import IconDefender from '@/components/icon/IconDefender.vue';
import IconGuard from '@/components/icon/IconGuard.vue';
import IconMedic from '@/components/icon/IconMedic.vue';
import IconSniper from '@/components/icon/IconSniper.vue';
import IconSpecialist from '@/components/icon/IconSpecialist.vue';
import IconSupporter from '@/components/icon/IconSupporter.vue';
import IconVanguard from '@/components/icon/IconVanguard.vue';

/**
 * All operator background pictures based on their rarity
 */
export const OPERATOR_BACKGROUND = {
  3: '/operator-bg/common.jpg',
  4: '/operator-bg/rare.jpg',
  5: '/operator-bg/elite.jpg',
  6: '/operator-bg/senior.jpg',
};

/**
 * All operator class pictures based on their class
 * @type {{[key: string]: import('vue').Component}}}
 */
export const OPERATOR_CLASS = {
  caster: IconCaster,
  defender: IconDefender,
  guard: IconGuard,
  medic: IconMedic,
  sniper: IconSniper,
  specialist: IconSpecialist,
  supporter: IconSupporter,
  vanguard: IconVanguard,
};

/**
 * Get the picture of an operator based on the prefered art
 * @param {Operator} operator
 * @param {string[]|number[]|null} prefer
 * @returns {{name: string, link: string}}
 */
export const getOperatorPicture = (operator, prefer = ['E2', 'E1', 'base']) => {
  // Sort depending on prefer order using the art's name property
  const sortedArt = operator.art
    .filter((art) => !art.link.endsWith('/null/'))
    .sort((a, b) => {
      const aIndex = prefer.indexOf(a.name);
      const bIndex = prefer.indexOf(b.name);

      if (aIndex === -1) {
        return 1;
      }

      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    });

  return sortedArt[0] ?? { name: prefer[0] ?? 'base', link: null };
};

/**
 * Get the background picture of an operator based on their rarity
 * @param {Operator} operator
 * @returns {string}
 */
export const getOperatorBackground = (operator) =>
  OPERATOR_BACKGROUND[operator.rarity] ?? OPERATOR_BACKGROUND['3'];

/**
 * Get the class picture of an operator based on their class
 * @param {Operator} operator
 * @returns {import('vue').Component|null}
 */
export const getOperatorClass = (operator) => OPERATOR_CLASS[operator.class.toLowerCase()] ?? null;
