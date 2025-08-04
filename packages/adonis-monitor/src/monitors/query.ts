/// <reference types="@adonisjs/lucid/database_provider" />

import { ApplicationService } from '@adonisjs/core/types'
import Monitor from './base.js'
import { DbQueryEventNode } from '@adonisjs/lucid/types/database'

type QueryEntry = DbQueryEventNode & {
  driver: string | null
}

type QueryType = 'query'
export class QueryMonitor extends Monitor<QueryType> {
  get name(): QueryType {
    return 'query'
  }

  get title(): string {
    return 'Queries'
  }

  get routeName(): string {
    return 'queries'
  }

  get defaultConfig() {
    return this.baseConfig()
  }

  declare protected app: ApplicationService

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')
    this.app = app

    emitter.on('db:query', (payload) =>
      this._registerEntry({
        ...payload,
        driver: this.#getDriver(payload.connection),
      })
    )
  }

  #getDriver(conn: string): string | null {
    return this.app.config.get(`database.connections.${conn}.client`, null)
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    query: QueryEntry
  }
}
