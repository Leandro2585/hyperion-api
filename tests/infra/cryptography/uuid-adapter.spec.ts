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
  test('should call uuid.v4', () => {
    const sut = new UUIDAdapter()
    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  test('should return correct uuid', () => {
    mocked(v4).mockReturnValueOnce('any_uuid')
    const sut = new UUIDAdapter()
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_any_uuid')
  })
})
