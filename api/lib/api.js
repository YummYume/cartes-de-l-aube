/**
 * Returns all operators from the RhodesAPI
 * @returns {Promise<{name: string, rarity: string, alter?: string, description?: string, statistics: {base: {hp: number, atk: number, def: number}}, art: {name: string, link: string}[]}[]>}
 */
export const getOperators = async () => {
  const operators = await fetch(`${process.env.ARKNIGHTS_API_HOST}/operator`);
  const json = await operators.json();

  return json.map((operator) => ({
    name: operator.name,
    rarity: operator.rarity,
    alter: operator.alter === 'Not provided' ? null : operator.alter,
    description: operator.description,
    statistics: {
      base: {
        hp: operator.statistics.base.hp,
        atk: operator.statistics.base.atk,
        def: operator.statistics.base.def,
      },
    },
    art: operator.art,
  }));
};
