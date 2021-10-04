import { UniqueId } from '@infra/cryptography'

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
