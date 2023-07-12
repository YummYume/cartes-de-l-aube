export default {
  /**
   * @this {import('typeorm').Repository<User>}
   * @param {number} id
   * @returns {Promise<User|null>}
   */
  getUser(id) {
    return this.createQueryBuilder('user').where('user.id = :id', { id }).getOne();
  },
};
