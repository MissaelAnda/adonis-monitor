import { ApplicationService } from "@adonisjs/core/types"
import Monitor from "./base.js"
import { DbQueryEventNode } from "@adonisjs/lucid/types/database"
import { EntryFilterFn, MonitorBaseConfig } from "../types.js"

export type QueryEntryPayload = Omit<DbQueryEventNode, 'duration'> & {
  duration?: number,
}

type QueryType = 'query'
export class QueryMonitor extends Monitor<QueryType> {
  get name(): QueryType { return 'query' }

  get defaultConfig() { return this.baseConfig() }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    emitter.on('db:query', (payload) => this._registerEntry({
      ...payload,
      duration: payload.duration ? payload.duration[1] - payload.duration[0] : undefined,
    }))
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    query: QueryEntryPayload
  }
} 