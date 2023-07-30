export class Init1688749456277 {
  name = 'Init1688749456277';

  /**
   * @param {QueryRunner} queryRunner
   */
  // eslint-disable-next-line class-methods-use-this
  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE \`match_history_player\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`operators\` text NOT NULL,
                \`status\` enum ('winner', 'loser', 'abandon') NOT NULL,
                \`orundum\` int NOT NULL,
                \`userId\` int NULL,
                \`matchHistoryId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`match_history\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`startedAt\` timestamp NOT NULL,
                \`endedAt\` timestamp NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`username\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`image\` varchar(255) NOT NULL,
                \`orundum\` int NOT NULL,
                \`deck\` text NOT NULL,
                UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\`
            ADD CONSTRAINT \`FK_92452931cab6168402a881f23a6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\`
            ADD CONSTRAINT \`FK_262c371bab3599b99db8441621b\` FOREIGN KEY (\`matchHistoryId\`) REFERENCES \`match_history\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  /**
   * @param {QueryRunner} queryRunner
   */
  // eslint-disable-next-line class-methods-use-this
  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\` DROP FOREIGN KEY \`FK_262c371bab3599b99db8441621b\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\` DROP FOREIGN KEY \`FK_92452931cab6168402a881f23a6\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\`
        `);
    await queryRunner.query(`
            DROP TABLE \`user\`
        `);
    await queryRunner.query(`
            DROP TABLE \`match_history\`
        `);
    await queryRunner.query(`
            DROP TABLE \`match_history_player\`
        `);
  }
}
