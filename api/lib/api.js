import chalk from 'chalk';
import { Window } from 'happy-dom';

/**
 * All supported operator classes
 */
export const OPERATOR_CLASSES = [
  'Vanguard',
  'Guard',
  'Defender',
  'Medic',
  'Sniper',
  'Specialist',
  'Caster',
  'Supporter',
];

/**
 * All supported operator rarities
 */
export const OPERATOR_RARITIES = [3, 4, 5, 6];

/**
 * List of operator names that should be overridden when trying to fetch their art
 */
export const OPERATOR_NAME_OVERRIDES = {
  'Rosa (Poca)': 'Rosa',
};

/**
 * List of possible art names to use when trying to fetch an operator's art
 */
export const OPERATOR_ART_NAMES_OVERRIDES = {
  E1: ['Base', 'Default', 'Basic', 'Elite 1'],
  E2: ['Elite 2'],
};

/**
 * Defines the multiplier for each statistic of an operator, based on their class
 */
export const definedOperatorStatisticsByClass = {
  Vanguard: {
    hp: 1.1,
    atk: 1.1,
    def: 1,
  },
  Guard: {
    hp: 1.2,
    atk: 1.3,
    def: 0.75,
  },
  Defender: {
    hp: 1.5,
    atk: 0.6,
    def: 1.5,
  },
  Medic: {
    hp: 1.6,
    atk: 0.9,
    def: 0.9,
  },
  Sniper: {
    hp: 0.75,
    atk: 1.8,
    def: 0.75,
  },
  Caster: {
    hp: 0.9,
    atk: 1.6,
    def: 0.9,
  },
  Specialist: {
    hp: 1.1,
    atk: 1.1,
    def: 1.1,
  },
  Supporter: {
    hp: 1,
    atk: 1.3,
    def: 1,
  },
};

/**
 * Defines the multiplier for all statistics of an operator, based on their rarity
 */
export const definedOperatorStatisticsByRarity = {
  3: 1,
  4: 1.1,
  5: 1.2,
  6: 1.3,
};

/**
 * Returns the primary class of an operator
 * @param {import('../mongoose/models/Operator').OperatorModel} operator
 * @returns {string}
 */
export const getOperatorPrimaryClass = (operator) => {
  const primaryClass = operator.class[0] ?? 'Vanguard';

  return OPERATOR_CLASSES.includes(primaryClass) ? primaryClass : 'Vanguard';
};

/**
 * Returns the formatted statistics of an operator
 * @param {import('../mongoose/models/Operator').OperatorModel} operator
 * @returns {import('../mongoose/models/Operator').OperatorModel['statistics']}
 */
export const getDefinedOperatorStatisticsByClassAndRarity = (operator) => {
  const primaryClass = getOperatorPrimaryClass(operator);

  return {
    hp: Math.round(
      parseInt(operator.statistics.base.hp, 10) *
        definedOperatorStatisticsByClass[primaryClass].hp *
        definedOperatorStatisticsByRarity[operator.rarity]
    ),
    atk: Math.round(
      parseInt(operator.statistics.base.atk, 10) *
        definedOperatorStatisticsByClass[primaryClass].atk *
        definedOperatorStatisticsByRarity[operator.rarity]
    ),
    def: Math.round(
      parseInt(operator.statistics.base.def, 10) *
        definedOperatorStatisticsByClass[primaryClass].def *
        definedOperatorStatisticsByRarity[operator.rarity]
    ),
    cost: Math.min(Math.max(Math.round(parseInt(operator.statistics.base.cost, 10) / 4), 2), 10),
  };
};

/**
 * Returns an operator's art, using different endpoints if their art is missing from one
 * @param {import('../mongoose/models/Operator').OperatorModel} operator
 * @returns {Promise<import('../mongoose/models/Operator').OperatorModel['art']>}
 */
export const getOperatorArt = async (operator) => {
  /**
   * @type {typeof operator.art|null}
   */
  let fetchedArt = null;

  return Promise.all(
    operator.art.map(async (art) => {
      const isValidArt = await fetch(art.link);

      if (isValidArt.status === 404) {
        if (fetchedArt === null) {
          const artLink = await fetch(`${process.env.ARKNIGHTS_API_HOST}/art/${operator.name}`);
          const artJson = artLink.ok ? await artLink.json() : null;
          fetchedArt = artJson ?? fetchedArt;
        }

        const newArt = fetchedArt.find((validArt) => validArt.name === art.name);

        return newArt ?? art;
      }

      return art;
    })
  );
};

/**
 * Returns all operators from the RhodesAPI
 * @returns {Promise<import('../mongoose/models/Operator').OperatorModel[]>}
 */
export const getOperators = async () => {
  const operators = await fetch(`${process.env.ARKNIGHTS_API_HOST}/operator`);
  const json = await operators.json();

  return Promise.all(
    json
      .filter((operator) => {
        return (
          operator.statistics.base.error === undefined &&
          OPERATOR_CLASSES.includes(getOperatorPrimaryClass(operator)) &&
          OPERATOR_RARITIES.includes(parseInt(operator.rarity, 10))
        );
      })
      .map(async (operator) => ({
        name: operator.name,
        rarity: operator.rarity,
        alter: operator.alter === 'Not provided' ? null : operator.alter,
        description: operator.description === ' null' ? null : operator.description,
        statistics: getDefinedOperatorStatisticsByClassAndRarity(operator),
        class: getOperatorPrimaryClass(operator),
        art: operator.art,
      }))
  );
};

/**
 * Find all operator arts from the Arknights Wiki. This is mostly because the art links returned from the RhodesAPI are dead.
 * @param {import('../mongoose/models/Operator').OperatorModel} operator
 * @returns {Promise<{ name: string; link: string }[]|null>}
 */
export const findOperatorArts = async (operator) => {
  const operatorName = OPERATOR_NAME_OVERRIDES[operator.name] ?? operator.name;
  const url = `${process.env.ARKNIGHTS_ARTS_WIKI_HOST}/wiki/${operatorName}`;
  const artsRequest = await fetch(url);

  if (!artsRequest.ok) {
    // eslint-disable-next-line no-console
    console.error(
      chalk.red(
        `Error while fetching operator art for "${operatorName}" (${operator.name}) from the Arknights Wiki (status code ${artsRequest.status}).`
      )
    );

    return null;
  }

  const artsHtml = await artsRequest.text();
  const { art } = operator;
  const window = new Window({
    url: `${process.env.ARKNIGHTS_ARTS_WIKI_HOST}/wiki/${operatorName}`,
    settings: {
      disableJavaScriptEvaluation: true,
      disableJavaScriptFileLoading: true,
      disableCSSFileLoading: true,
      disableComputedStyleRendering: true,
    },
  });
  const { document } = window;

  document.body.innerHTML = artsHtml;

  const artsContainer =
    document.querySelector('.druid-main-images-files') ??
    document.querySelector('.druid-main-image');

  if (!artsContainer) {
    // eslint-disable-next-line no-console
    console.warn(
      chalk.yellow(
        `Art for operator "${operatorName}" (${operator.name}) could not be retrieved. This operator might have outdated pictures as a result.`
      )
    );

    window.close();

    return null;
  }

  art.forEach((operatorArt, index) => {
    const possibleArtNames = OPERATOR_ART_NAMES_OVERRIDES[operatorArt.name] ?? [operatorArt.name];

    /**
     * @type {HTMLImageElement|null}
     */
    let concernedArt;

    possibleArtNames.forEach((artName) => {
      if (concernedArt) {
        return;
      }

      if (artsContainer.firstChild && artsContainer.firstChild.nodeName === 'A') {
        concernedArt = artsContainer.querySelector('img');
      } else {
        const artContainer = artsContainer.querySelector(`[data-druid-tab-key*="${artName}"]`);

        if (artContainer) {
          concernedArt = artContainer.querySelector(`img`);
        }
      }

      if (concernedArt) {
        const src = concernedArt.getAttribute('src');

        if (src) {
          art[index].link = `${process.env.ARKNIGHTS_ARTS_WIKI_HOST}${src}`;
        }
      }
    });
  });

  window.close();

  return art;
};
