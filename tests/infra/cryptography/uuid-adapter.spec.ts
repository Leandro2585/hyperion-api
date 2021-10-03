import { UUIDGenerator } from '@core/protocols/cryptography'
import { v4 } from 'uuid'

export class UUIDAdapter implements UUIDGenerator {
  uuid (args: UUIDGenerator.Input): string {
    return v4()
  }
}

jest.mock('uuid')

describe('uuid adapter', () => {
  test('should call uuid.v4', () => {
    const sut = new UUIDAdapter()
    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })
})
