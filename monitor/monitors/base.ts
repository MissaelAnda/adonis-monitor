import { ApplicationService } from "@adonisjs/core/types"
import { Entry, EntryFilterFn, EntryTransformerFn, EntryType, MonitorBaseConfig } from "../types.js"
import { DateTime } from "luxon"
import monitor from '../service/main.js'
import { Payloads, Configurations } from "adonis-monitor"
import { randomUUID } from "node:crypto"

export default abstract class Monitor<Type extends EntryType> {
  declare protected config: Configurations[Type]

  setConfig(config: Configurations[Type]) {
    this.config = config
  }

  abstract get defaultConfig(): Configurations[Type]

  protected baseConfig(): MonitorBaseConfig<Type> {
    return {
      enabled: true,
      filters: [],
      transformers: [],
    }
  }

  abstract get name(): Type

  get enabled() {
    return this.config.enabled
  }

  set enabled(enabled: boolean) {
    this.config.enabled = enabled
  }

  get filters(): EntryFilterFn<Type>[] {
    return this.config.filters
  }

  get transformers(): EntryTransformerFn<Type>[] {
    return this.config.transformers
  }

  abstract register(app: ApplicationService): void | Promise<void>

  protected _registerEntry(payload: Payloads[Type]) {
    const entry: Entry<Type> = {
      id: randomUUID(),
      type: this.name,
      ts: DateTime.local(),
      payload,
    }

    if (!this.shouldIgnore(entry)) {
      entry.payload = this.transformers.reduce((entry, transformer) => transformer(entry), entry.payload)
      monitor.pushEntry(entry)
    }
  }

  protected shouldIgnore(entry: Entry<Type>) {
    return !this.enabled || this.filters.findIndex(filter => filter(entry) === true) >= 0
  }
}