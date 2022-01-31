export interface DatabaseTransaction {
  commit: () => Promise<void>
  rollback: () => Promise<void>
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
}
