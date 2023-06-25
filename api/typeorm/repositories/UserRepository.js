export default {
  /**
   * @this { import('typeorm').Repository<User> }
   * @param {number} id
   * @returns User|null
   */
  getUser(id) {
    return this.createQueryBuilder('user')
      .select(['user.id', 'user.username', 'user.orundum', 'user.image'])
      .where('user.id = :id', { id })
      .getOne();
  },
};
