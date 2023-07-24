/**
 * @this {import('typeorm').Repository<User>}
 * @param {string} field
 * @param {string} value
 * @returns {import('typeorm').UpdateQueryBuilder<User>}
 */
function updateQuantity(field, value) {
  return this.createQueryBuilder('user')
    .update()
    .setParameter(field, value)
    .set({
      [field]: () => `user.${field} + :${field}`,
    });
}

export default {
  /**
   * @this {import('typeorm').Repository<User>}
   * @param {number} id
   * @returns {Promise<User|null>}
   */
  getUser(id) {
    return this.createQueryBuilder('user').where('user.id = :id', { id }).getOne();
  },

  /**
   * Increment/decrement orundum
   * @this {import('typeorm').Repository<User>}
   * @param {number} id
   * @param {number} value
   * @returns {Promise<User|null>}
   */
  updateQuantityOrundum(id, value) {
    return updateQuantity('orundum', value).bind(this).where('user.id = :id', { id }).execute();
  },

  /**
   * Increment/decrement orundum and ranking points
   * @this {import('typeorm').Repository<User>}
   * @param {number} id
   * @param {number} orundum
   * @param {number} rankingPoints
   * @returns {Promise<User|null>}
   */
  updateQuantity(id, { orundum, rankingPoints }) {
    return this.createQueryBuilder('user')
      .update()
      .setParameters({ orundum, rankingPoints })
      .set({
        orundum: () => 'user.orundum + :orundum',
        rankingPoints: () => 'user.rankingPoints + :rankingPoints',
      })
      .where('user.id = :id', { id })
      .execute();
  },

  /**
   * Increment/decrement ranking points
   * @this {import('typeorm').Repository<User>}
   * @param {number} id
   * @param {number} value
   * @returns {Promise<User|null>}
   */
  updateQuantityRankingPoints(id, value) {
    return updateQuantity('rankingPoints', value)
      .bind(this)
      .where('user.id = :id', { id })
      .execute();
  },
};
