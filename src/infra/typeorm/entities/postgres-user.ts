import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('tb_user')
export class PostgresUser {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  id!: string

  @Column({ nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string

  @Column()
  avatarUrl?: string

  @Column()
  initials?: string
}
