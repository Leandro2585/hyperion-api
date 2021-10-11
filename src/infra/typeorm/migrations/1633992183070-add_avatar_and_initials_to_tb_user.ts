import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addAvatarAndInitialsToTbUser1633992183070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('tb_user', [
      new TableColumn({ name: 'avatar_url', type: 'varchar', isNullable: true }), 
      new TableColumn({ name: 'initials', type: 'varchar', isNullable: true })
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tb_user', 'avatar_url')
    await queryRunner.dropColumn('tb_user', 'initials')
  }

}
