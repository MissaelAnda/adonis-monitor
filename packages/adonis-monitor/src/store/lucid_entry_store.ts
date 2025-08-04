import { UUID } from 'node:crypto'
import { Entry, EntryType } from '../types.js'
import { EntryPaginationOptions, EntryPaginationResponse, EntryStore } from './entry_store.js'
import MonitorEntry from './monitor_entry.js'
import { BaseModel } from '@adonisjs/lucid/orm'
import is from '@adonisjs/core/helpers/is'

export class LucidEntryStore extends EntryStore {
  #entries: Entry<any>[] = []

  #chunkSize: number = 1000

  async find(id: UUID): Promise<Entry<EntryType> | null> {
    const entry = await MonitorEntry.find(id)
    return entry?.toEntry() ?? null
  }

  async get<Type extends EntryType>(
    type: Type,
    options?: EntryPaginationOptions
  ): Promise<EntryPaginationResponse<Type>> {
    let query = MonitorEntry.query().where('type', type).debug(false)

    if (options?.sorts) {
      for (const sorting of options!.sorts ?? []) {
        query.orderBy(sorting.field, sorting.sort)
      }
    }

    // Apply sort by `created_at` descending only if the user didn't apply a custom sort for that field
    // Apply after user sorts to grant the lesser precedence to sorting
    if (!options?.sorts || options.sorts.findIndex((s) => s.field === 'created_at') < 0) {
      query.orderBy('created_at', 'desc')
    }

    const page = Math.max(options?.page ?? 1, 1)
    const size = Math.min(Math.max(options?.size ?? 20, 1), 200) // clamp from 1 to 200
    const paginationResult = await query.paginate(page, size)
    const entries = paginationResult.all() as MonitorEntry<Type>[]

    return {
      entries: entries.map((entry) => entry.toEntry()),
      pagination: {
        total: paginationResult.total,
        currentPage: paginationResult.currentPage,
        hasMorePages: paginationResult.hasMorePages,
      },
    }
  }

  push(entry: Entry<any>) {
    this.#entries.push(entry)

    if (this.#entries.length > this.#chunkSize) {
      this.flush()
    }
  }

  async flush() {
    if (this.#entries.length === 0) {
      return
    }

    const model = new MonitorEntry()
    const formattedEntries = this.#entries.map((entry) => {
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

    await client.insertQuery().debug(false).table(MonitorEntry.table).multiInsert(formattedEntries)
  }

  /**
   * Update an existing entry
   */
  async update(id: UUID, payload: Entry<any>['payload']): Promise<boolean> {
    const [result] = await MonitorEntry.query().where('id', id).update({ payload })

    return result > 0
  }

  /**
   * Delete an existing entry
   */
  async delete(id: UUID): Promise<boolean> {
    // Prevent sending invalid ids to the database both to prevent a useless db call and to prevent
    // possible errors thrown by Postgres if the column is uuid
    if (
      !is.string(id) ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    ) {
      return false
    }

    // If the entry is queued for storing remove it from the queue
    this.#entries = this.#entries.filter((e) => e.id === id)

    const [count] = await MonitorEntry.query().where('id', id).delete()
    return count > 0
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
