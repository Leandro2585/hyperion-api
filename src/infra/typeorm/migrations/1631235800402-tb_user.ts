import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class tbUser1631235800402 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'tb_user',
      columns: [
        {
          name: 'user_id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'u,uid_generate_v4()'
        },
        {
          name: 'name',
          type: 'varchar'
        },
        {
          name: 'email',
          type: 'varchar'
        },
        {
          name: 'password',
          type: 'varchar'
        }
      ]
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tb_user')
  }
}
