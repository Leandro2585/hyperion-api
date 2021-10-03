import { UUIDGenerator } from '@core/protocols/cryptography'
import { mocked } from 'ts-jest/utils'
import { v4 } from 'uuid'

export class UUIDAdapter implements UUIDGenerator {
  uuid (args: UUIDGenerator.Input): UUIDGenerator.Output {
    return `${args.key}_${v4()}`
  }
}

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
