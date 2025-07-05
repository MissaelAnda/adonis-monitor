import { Entry, EntryType } from "../types.js"
import MonitorEntry from "./monitor_entry.js"
import { UUID } from "node:crypto"
import { BaseModel } from "@adonisjs/lucid/orm"

type EntryPagination = {
  page: number,
  size: number,
  sorts: [],
  filters: [],
}

type EntryPaginationResponse<Type extends EntryType> = {
  entries: Entry<Type>[],
  total: number,
}

/**
 * The implementation of how the entries should be stored as they are being
 * registered by the system monitors
 */
export abstract class EntryStore {
  abstract find(id: UUID): Promise<Entry<EntryType> | null> | Entry<EntryType> | null

  abstract get<Type extends EntryType>(type: Type, options?: EntryPagination): Promise<EntryPaginationResponse<Type>> | EntryPaginationResponse<Type>

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
}

export class DatabaseEntryStore extends EntryStore {
  #entries: Entry<any>[] = []

  #chunkSize: number = 1000

  async find(id: UUID): Promise<Entry<EntryType> | null> {
    const entry = await MonitorEntry.find(id)
    return entry?.toEntry() ?? null
  }

  async get<Type extends EntryType>(type: Type, options?: EntryPagination): Promise<EntryPaginationResponse<Type>> {
    const paginationResult = await MonitorEntry.query().where('type', type).orderBy('created_at', 'desc').paginate(options?.page ?? 1, options?.size ?? 20)
    const entries = paginationResult.all() as MonitorEntry<Type>[]

    return {
      entries: entries.map(entry => entry.toEntry()),
      total: paginationResult.total,
    }
  }

  push(entry: Entry<any>) {
    this.#entries.push(entry)

    if (this.#entries.length > this.#chunkSize) {
      this.flush()
    }
  }

  async flush() {
    if (this.#entries.length == 0) {
      return
    }

    const model = new MonitorEntry()
    const formattedEntries = this.#entries.map(entry => {
      model.$attributes = {}
      model.merge({
        id: entry.id,
        type: entry.type,
        payload: entry.payload,
        createdAt: entry.ts,
        updatedAt: entry.ts,
      })

      return this.prepareForAdapter(model)
    })

    // Flush entries before awaiting DB insert to prevent queued async pushes
    this.#entries = []

    // TODO: Inject connection via store config
    const client = MonitorEntry.$adapter.modelConstructorClient(MonitorEntry)

    await client.insertQuery()
      .debug(false).table(MonitorEntry.table)
      .multiInsert(formattedEntries)
  }

  /**
   * Extracted from BaseModel protected function
   */
  protected prepareForAdapter(model: MonitorEntry<any>) {
    const Model = model.constructor as typeof BaseModel
    const attributes = model.$attributes

    return Object.keys(attributes).reduce((result: any, key) => {
      const column = Model.$getColumn(key)!

      const value =
        typeof column.prepare === 'function'
          ? column.prepare(attributes[key], key, model)
          : attributes[key]

      result[column.columnName] = value
      return result
    }, {})
  }
}
