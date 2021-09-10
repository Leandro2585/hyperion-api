import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'tb_users' })
export class PostgresUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'name', nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string
}
