import { UUIDGenerator } from '@core/protocols/cryptography'

class UniqueId {
  constructor (private readonly date: Date) {}

  uuid ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    return key + '_' +
    this.date.getFullYear() +
    (this.date.getMonth() + 1).toString().padStart(2, '0') +
    this.date.getDate().toString().padStart(2, '0') +
    this.date.getHours().toString().padStart(2, '0') +
    this.date.getMinutes().toString().padStart(2, '0') +
    this.date.getSeconds().toString().padStart(2, '0')
  }
}

describe('unique-id adapter', () => {
  let key: string

  beforeAll(() => {
    key = 'any_key'
  })

  test('should UniqueId returns correct uuid ', () => {
    const sut = new UniqueId(new Date(2021, 9, 3, 10, 10, 10))
    const uuid = sut.uuid({ key })

    expect(uuid).toBe('any_key_20211003101010')
  })

  test('should UniqueId returns correct uuid', () => {
    const sut = new UniqueId(new Date(2018, 2, 10, 18, 1, 0))
    const uuid = sut.uuid({ key })

    expect(uuid).toBe('any_key_20180310180100')
  })
})
