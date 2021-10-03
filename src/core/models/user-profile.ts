export class UserProfile {
  initials?: string
  avatarUrl?: string

  constructor (readonly id: string) {}

  setAvatar ({ avatarUrl, name }: { avatarUrl?: string, name?: string }): void {
    this.avatarUrl = avatarUrl
    if (avatarUrl === undefined && name !== undefined && name !== '') {
      const firstLetters = name.match(/\b(.)/g)!
      if (firstLetters.length > 1) {
        this.initials = `${firstLetters.shift()!}${firstLetters.pop() ?? ''}`.toUpperCase()
      } else {
        this.initials = name.substr(0, 2)?.toUpperCase()
      }
    }
  }
}
