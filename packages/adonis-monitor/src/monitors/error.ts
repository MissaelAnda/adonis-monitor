import { ApplicationService } from '@adonisjs/core/types'
import { ErrorEvent } from '../types.js'
import { DateTime } from 'luxon'
import Monitor from './base.js'

type ErrorEntryPayload = ErrorEvent & { error: { class: string }; resolvedAt: DateTime | null }

type ErrorType = 'error'
export class ErrorMonitor extends Monitor<ErrorType> {
  get name(): ErrorType {
    return 'error'
  }

  get title(): string {
    return 'Errors'
  }

  get routeName(): string {
    return 'errors'
  }

  get defaultConfig() {
    return this.baseConfig()
  }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    // TODO: extract requestId from HttpContext if the exception was thrown during a request
    // so we can link the error with the request that triggered it
    emitter.on('monitor:error', ({ error, message }) =>
      this._registerEntry({
        error: {
          stack: error.stack,
          cause: error.cause,
          class: error.constructor.name,
          ...error,
        },
        message,
        resolvedAt: null,
      })
    )
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    error: ErrorEntryPayload
  }
}
