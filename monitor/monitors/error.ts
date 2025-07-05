import { ApplicationService } from "@adonisjs/core/types"
import Monitor from "./base.js"

type ErrorEntryPayload = ErrorEvent & { error: { class: string } }
export type ErrorEvent = {
  error: Error,
  message: string,
}

type ErrorType = 'error'
export class ErrorMonitor extends Monitor<ErrorType> {
  get name(): ErrorType { return 'error' }

  get defaultConfig() { return this.baseConfig() }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    // TODO: extract requestId from HttpContext if the exception was thrown during a request
    // so we can link the error with the request that triggered it
    emitter.on('monitor:error', ({ error, message }) => this._registerEntry({
      error: {
        stack: error.stack,
        cause: error.cause,
        class: error.constructor.name,
        ...error,
      },
      message,
    }))
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    error: ErrorEntryPayload
  }
}
