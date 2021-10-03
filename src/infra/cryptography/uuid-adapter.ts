import { v4 } from 'uuid'

import { UUIDGenerator } from '@core/protocols/cryptography'

export class UUIDAdapter implements UUIDGenerator {
  uuid (args: UUIDGenerator.Input): UUIDGenerator.Output {
    return `${args.key}_${v4()}`
  }
}
