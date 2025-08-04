import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import type { Entry, EntryType, Payload } from '../types.js'
import type { UUID } from 'node:crypto'

export default class MonitorEntry<Type extends EntryType> extends BaseModel {
  @column({ isPrimary: true })
  declare id: UUID

  @column()
  declare type: Type

  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => JSON.parse(value),
  })
  declare payload: any

  getPayload() {
    return this.payload as Payload<Type>
  }

  toEntry(): Entry<Type> {
    return {
      id: this.id,
      type: this.type,
      ts: this.createdAt,
      payload: this.payload,
    }
  }

  @column.dateTime({ autoCreate: false })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: true })
  declare updatedAt: DateTime
}
