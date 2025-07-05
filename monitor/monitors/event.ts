import { ApplicationService, EmitterService } from "@adonisjs/core/types"
import Monitor from "./base.js"
import is from '@adonisjs/core/helpers/is'
import { AllowedEventTypes } from "@adonisjs/events/types"
import { HttpRequestFinishedPayload } from "@adonisjs/http-server/types"

type EventEntryPayload = {
  event: AllowedEventTypes,
  data: any,
  listeners: string[],
}

type EventType = 'event'
export class EventMonitor extends Monitor<EventType> {
  get name(): EventType { return 'event' }

  get defaultConfig() { return this.baseConfig() }

  declare protected emitter: EmitterService
  declare protected app: ApplicationService

  async register(app: ApplicationService) {
    this.app = app
    this.emitter = await app.container.make('emitter')

    this.emitter.onAny((event: AllowedEventTypes, data: any) => {
      const listeners = this.#formatListeners(event)
      this._registerEntry({ event, data: this.#formatData(event, data), listeners })
    })
  }

  #formatData(event: AllowedEventTypes, data: any) {
    if (event == 'http:request_completed') {
      const { ctx }: HttpRequestFinishedPayload = data
      data = {
        id: ctx.request.id(),
        url: ctx.request.url(),
        method: ctx.request.method(),
        host: ctx.request.host(),
      }
    }

    return data
  }

  #formatListeners(event: AllowedEventTypes) {
    const listeners = this.emitter.eventsListeners.get(event)
    if (!listeners) {
      return []
    }

    const anonymousFunctionFormatter = (func: Function) => {
      let name = 'Anonymous function'
      if (func.name != '' || this.app.inDev) {
        name += ` ${func.name || `\`${func.toString()}\``}`
      }
      return name
    }

    return listeners.entries().map(([key, _]) => {
      if (typeof key == 'string') {
        return key
      }

      if (is.array(key)) {
        const [klass, handler] = key

        let name = is.class(klass) ? klass.name : anonymousFunctionFormatter(klass)
        if (handler) {
          name += `@${handler}`
        }

        return name
      }

      return anonymousFunctionFormatter(key)
    }).toArray()
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    event: EventEntryPayload
  }
}