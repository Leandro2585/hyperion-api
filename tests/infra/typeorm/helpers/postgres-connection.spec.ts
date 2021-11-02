export class PostgresConnection {
  private static instance?: PostgresConnection
  private constructor () {}

  static getInstance (): PostgresConnection {
    if(PostgresConnection.instance === undefined) {
      PostgresConnection.instance = new PostgresConnection
    }
    return PostgresConnection.instance
  }
}

describe('postgres connection', () => {
  test('should have only one instance', () => {
    const sut = PostgresConnection.getInstance()
    const sut2 = PostgresConnection.getInstance()
    
    expect(sut).toBe(sut2)
  })
})