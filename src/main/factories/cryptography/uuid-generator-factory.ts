import { UUIDAdapter, UniqueId } from '@infra/cryptography'

export const makeUUIDGenerator = (): UUIDAdapter => {
  return new UUIDAdapter()
}

export const makeUniqueIdGenerator = (): UniqueId => {
  return new UniqueId()
}