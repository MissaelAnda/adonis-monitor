import { ApplicationService } from "@adonisjs/core/types"
import Monitor from "./base.js"
import { DbQueryEventNode } from "@adonisjs/lucid/types/database"

type QueryType = 'query'
export class QueryMonitor extends Monitor<QueryType> {
  get name(): QueryType { return 'query' }

  get title(): string { return 'Queries' }

  get routeName(): string { return 'queries' }

  get defaultConfig() { return this.baseConfig() }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    emitter.on('db:query', (payload) => this._registerEntry(payload))
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    query: DbQueryEventNode
  }
}