import { ApplicationService } from '@adonisjs/core/types'
import Monitor from './base.js'
import { LogEvent, LogLevel } from '../types.js'

type LogEntryPayload = Omit<LogEvent, 'logger' | 'level'> & { level: string }

type LogType = 'log'
export class LogMonitor extends Monitor<LogType> {
  get name(): LogType {
    return 'log'
  }

  get title(): string {
    return 'Logs'
  }

  get routeName(): string {
    return 'logs'
  }

  get defaultConfig() {
    return this.baseConfig()
  }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    emitter.on('monitor:log', (event) =>
      this._registerEntry({ args: event.args, level: LogLevel[event.level] })
    )
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    log: LogEntryPayload
  }
}
