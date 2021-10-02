import { UserProfile } from '@core/models'

describe('user-profile model', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile('any_id')
  })

  test('should create with empty initials when avatarUrl is provided', () => {
    sut.setAvatar({ avatarUrl: 'any_url', name: 'any_name' })

    expect(sut).toEqual({ id: 'any_id', avatarUrl: 'any_url', initials: undefined })
  })

  test('should create with empty initials when avatarUrl  is provided', () => {
    sut.setAvatar({ avatarUrl: 'any_url' })

    expect(sut).toEqual({ id: 'any_id', avatarUrl: 'any_url', initials: undefined })
  })

  test('should create initials with first letter of first and last names', () => {
    sut.setAvatar({ name: 'leandro real vieira' })

    expect(sut).toEqual({ id: 'any_id', avatarUrl: undefined, initials: 'LV' })
  })

  test('should create initials with first two letters of first name', () => {
    sut.setAvatar({ name: 'leandro' })

    expect(sut).toEqual({ id: 'any_id', avatarUrl: undefined, initials: 'LE' })
  })

  test('should create initials with first letter', () => {
    sut.setAvatar({ name: 'l' })

    expect(sut).toEqual({ id: 'any_id', avatarUrl: undefined, initials: 'L' })
  })

  test('should create with empty initials when name and avatarUrl are not provided', () => {
    sut.setAvatar({})

    expect(sut).toEqual({
      id: 'any_id',
      avatarUrl: undefined,
      initials: undefined
    })
  })
})
