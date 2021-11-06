import { set, reset } from 'mockdate'

import { UniqueId } from '@infra/cryptography'

describe('unique-id adapter', () => {
  beforeAll(() => set(new Date(2021, 9, 3, 10, 10, 10)))

  afterAll(() => reset())

  test('should create a unique id', () => {
    const sut = new UniqueId()
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20211003101010')
  })
})
