export class UpdateOperators1689180538446 {
  name = 'UpdateOperators1689180538446';

  /**
   * @param {QueryRunner} queryRunner
   */
  // eslint-disable-next-line class-methods-use-this
  async up(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`operators\` text NOT NULL DEFAULT ''
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\` DROP FOREIGN KEY \`FK_92452931cab6168402a881f23a6\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\` DROP FOREIGN KEY \`FK_262c371bab3599b99db8441621b\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\` CHANGE \`operators\` \`operators\` text NOT NULL DEFAULT ''
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\` CHANGE \`userId\` \`userId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\` CHANGE \`matchHistoryId\` \`matchHistoryId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`image\` \`image\` varchar(255) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`deck\` \`deck\` text NOT NULL DEFAULT ''
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
            ALTER TABLE \`user\` CHANGE \`deck\` \`deck\` text NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`image\` \`image\` varchar(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\` CHANGE \`matchHistoryId\` \`matchHistoryId\` int NULL DEFAULT 'NULL'
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\` CHANGE \`operators\` \`operators\` text NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\`
            ADD CONSTRAINT \`FK_262c371bab3599b99db8441621b\` FOREIGN KEY (\`matchHistoryId\`) REFERENCES \`match_history\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`match_history_player\`
            ADD CONSTRAINT \`FK_92452931cab6168402a881f23a6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`operators\`
        `);
  }
}
