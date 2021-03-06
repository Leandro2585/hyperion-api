import { FacebookAccount } from '@core/models'

describe('facebook-account model', () => {
  const facebookData = {
    name: 'any_fb_name',
    email: 'any_fb_email',
    facebookId: 'any_fb_id'
  }

  test('should create with facebook data only', () => {
    const sut = new FacebookAccount(facebookData)

    expect(sut).toEqual({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })

  test('should update name if its empty', () => {
    const accountData = { id: 'any_id' }

    const sut = new FacebookAccount(facebookData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })

  test('should not update name if its not empty', () => {
    const accountData = { id: 'any_id', name: 'any_name' }

    const sut = new FacebookAccount(facebookData, accountData)

    expect(sut).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })
})
