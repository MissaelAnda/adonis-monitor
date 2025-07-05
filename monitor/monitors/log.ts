import { ApplicationService } from "@adonisjs/core/types"
import Monitor from "./base.js"
import { LogFn, Logger } from "pino"

export type LogEvent = {
  logger: Logger,
  args: Parameters<LogFn>,
  level: LogLevel,
}

type LogEntryPayload = Omit<LogEvent, 'logger' | 'level'> & { level: string }

type LogType = 'log'
export class LogMonitor extends Monitor<LogType> {
  get name(): LogType { return 'log' }

  get defaultConfig() { return this.baseConfig() }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    emitter.on('monitor:log', (event) => this._registerEntry({ args: event.args, level: LogLevel[event.level] }))
  }
}

export enum LogLevel {
  TRACE = 10,
  DEBUG = 20,
  INFO = 30,
  WARN = 40,
  ERROR = 50,
  FATAL = 60
}

declare module 'adonis-monitor' {
  interface Payloads {
    log: LogEntryPayload
  }
}