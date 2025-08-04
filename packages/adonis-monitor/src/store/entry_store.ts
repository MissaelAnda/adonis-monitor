import { Entry, EntryType } from '../types.js'
import { UUID } from 'node:crypto'

type Sort = { field: string; sort: 'asc' | 'desc' }
export type EntryPaginationOptions = {
  page: number
  size?: number | null
  sorts?: Sort[]
  filters?: string[]
}

export type EntryPaginationResponse<Type extends EntryType> = {
  entries: Entry<Type>[]
  pagination: {
    total: number
    currentPage: number
    hasMorePages: boolean
  }
}

/**
 * The implementation of how the entries should be stored as they are being
 * registered by the system monitors
 */
export abstract class EntryStore {
  abstract find(id: UUID): Promise<Entry<EntryType> | null> | Entry<EntryType> | null

  abstract get<Type extends EntryType>(
    type: Type,
    options?: EntryPaginationOptions
  ): Promise<EntryPaginationResponse<Type>> | EntryPaginationResponse<Type>

  /**
   * This is called per monitor per entry at the moment the monitor calls `Monitor._registerEntry`
   *
   * @param entry The entry recorded
   */
  abstract push(entry: Entry<any>): void

  /**
   * Flush all the entries
   */
  abstract flush(): void

  /**
   * Update an existing entry
   */
  abstract update(id: UUID, entry: Entry<any>['payload']): Promise<boolean> | boolean

  /**
   * Delete an existing entry
   */
  abstract delete(id: UUID): Promise<boolean> | boolean
}
