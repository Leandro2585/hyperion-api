const root = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'

module.exports = {
  name: "default",
  type: "postgres",
  host: "localhost",
  username: "postgres",
  password: "12345678",
  database: "postgres",
  port: 5432,
  entities: [
    `./${root}/infra/typeorm/entities/*.ts`
  ],
  migrations: [
    `./${root}/infra/typeorm/migrations/*.ts`
  ],
  cli: {
    migrationsDir: `./${root}/infra/typeorm/migrations`
  }
}
