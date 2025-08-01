import { ApplicationService, EmitterService } from "@adonisjs/core/types"
import Monitor from "./base.js"
import { AllowedEventTypes } from "@adonisjs/events/types"
import { HttpRequestFinishedPayload } from "@adonisjs/http-server/types"
import { formatHandler } from "../helpers.js"
import { HandlerInfo } from "../types.js"

type EventEntryPayload = {
  event: AllowedEventTypes,
  data: any,
  listeners: HandlerInfo[],
}

type EventType = 'event'
export class EventMonitor extends Monitor<EventType> {
  get name(): EventType { return 'event' }

  get title(): string { return 'Events' }

  get routeName(): string { return 'events' }

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

    return listeners.entries().map(([listener, _]) => formatHandler(listener)).toArray()
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    event: EventEntryPayload
  }
}