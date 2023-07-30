export class UpdateMatchHistoryPlayer1690108296939 {
    name = 'UpdateMatchHistoryPlayer1690108296939'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\` DROP COLUMN \`operators\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\` DROP COLUMN \`orundum\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\`
            ADD \`deck\` text NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\`
            ADD \`rankingPoint\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\` DROP FOREIGN KEY \`FK_92452931cab6168402a881f23a6\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\` DROP FOREIGN KEY \`FK_262c371bab3599b99db8441621b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\` CHANGE \`userId\` \`userId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\` CHANGE \`matchHistoryId\` \`matchHistoryId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_b046318e0b341a7f72110b75857\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\` CHANGE \`paidAt\` \`paidAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\` CHANGE \`userId\` \`userId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`image\` \`image\` varchar(255) NULL
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
            ALTER TABLE \`user\` CHANGE \`image\` \`image\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\` CHANGE \`paidAt\` \`paidAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP()
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\`
            ADD CONSTRAINT \`FK_b046318e0b341a7f72110b75857\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\` CHANGE \`matchHistoryId\` \`matchHistoryId\` int NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'
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
            ALTER TABLE \`match_history_player\` DROP COLUMN \`rankingPoint\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\` DROP COLUMN \`deck\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\`
            ADD \`orundum\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`match_history_player\`
            ADD \`operators\` text NOT NULL DEFAULT ''''
        `);
    }
}
