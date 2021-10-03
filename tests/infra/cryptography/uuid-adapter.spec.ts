import { v4 } from 'uuid'
import { mocked } from 'ts-jest/utils'

import { UUIDAdapter } from './uuid-adapter'

jest.mock('uuid')

describe('uuid adapter', () => {
  let sut: UUIDAdapter

  beforeAll(() => {
    mocked(v4).mockReturnValue('any_uuid')
  })

  beforeEach(() => {
    sut = new UUIDAdapter()
  })

  test('should call uuid.v4', () => {
    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  test('should return correct uuid', () => {
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_any_uuid')
  })
})
