export class Init1690636261258 {
    name = 'Init1690636261258'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`match_history_player\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`deck\` text NOT NULL DEFAULT '',
                \`status\` enum ('winner', 'loser', 'abandon') NOT NULL,
                \`rankingPoints\` int NOT NULL,
                \`userId\` int NULL,
                \`matchHistoryId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`match_history\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`startedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`endedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`payment\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`stripePaymentId\` varchar(255) NOT NULL,
                \`price\` float NOT NULL,
                \`amount\` int NOT NULL,
                \`paidAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`userId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`username\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`image\` varchar(255) NULL,
                \`orundum\` int NOT NULL,
                \`rankingPoints\` int NOT NULL DEFAULT '0',
                \`deck\` text NOT NULL DEFAULT '',
                \`operators\` text NOT NULL DEFAULT '',
                \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user',
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
        await queryRunner.query(`
            ALTER TABLE \`payment\`
            ADD CONSTRAINT \`FK_b046318e0b341a7f72110b75857\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_b046318e0b341a7f72110b75857\`
        `);
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
            DROP TABLE \`payment\`
        `);
        await queryRunner.query(`
            DROP TABLE \`match_history\`
        `);
        await queryRunner.query(`
            DROP TABLE \`match_history_player\`
        `);
    }
}
