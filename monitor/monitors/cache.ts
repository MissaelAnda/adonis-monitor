import { ApplicationService } from "@adonisjs/core/types"
import Monitor from "./base.js"

type CacheEventType = 'cleared' | 'deleted' | 'hit' | 'miss' | 'written'
type CacheEvent = {
  store: string,
  key?: string,
  value?: any,
  graced?: boolean,
}
type CacheEntryPayload = CacheEvent & { event: CacheEventType }

type CacheType = 'cache'
export class CacheMonitor extends Monitor<CacheType> {
  get name(): CacheType { return 'cache' }

  get defaultConfig() { return this.baseConfig() }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    emitter.on('cache:cleared', this.#createEventRegister('cleared'))
    emitter.on('cache:deleted', this.#createEventRegister('deleted'))
    emitter.on('cache:hit', this.#createEventRegister('hit'))
    emitter.on('cache:miss', this.#createEventRegister('miss'))
    emitter.on('cache:written', this.#createEventRegister('written'))
  }

  #createEventRegister(event: CacheEventType) {
    return (payload: CacheEvent) => {
      this._registerEntry({
        ...payload,
        event,
      })
    }
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    cache: CacheEntryPayload
  }
}