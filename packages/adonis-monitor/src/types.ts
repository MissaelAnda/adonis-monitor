/// <reference path="./types.d.ts" />

import { MiddlewareFn, OneOrMore, ParsedNamedMiddleware } from '@adonisjs/core/types/http'
import Monitor from './monitors/base.js'
import { DateTime } from 'luxon'
import { Payloads } from 'adonis-monitor'
import { Configurations } from 'adonis-monitor'
import { UUID } from 'node:crypto'
import { LazyImport } from '@adonisjs/events/types'
import { LogFn, Logger } from 'pino'

export type SerializedMonitor = {
  name: string
  title: string
  routeName: string
}

// ----------
// Entries
// ----------
export type EntryType = keyof Payloads
export type EntryFilterFn<Type extends EntryType> = (
  entry: Entry<Type>
) => boolean | null | undefined | void
// TODO: allow transformer to add values but not change them
// export type EntryTransformerFn<Type extends EntryType, NewPayload extends Payloads[Type]> = (entry: Entry<Type>) => NewPayload
export type EntryTransformerFn<Type extends EntryType> = (payload: Payloads[Type]) => Payloads[Type]

export type AuthData = { user: any | number; guard: string }
export type Payload<Type extends EntryType> = Payloads[Type] & { auth?: Partial<AuthData> }

export type Entry<Type extends EntryType> = {
  id: UUID
  type: Type
  ts: DateTime
  payload: Payload<Type>
}

// ----------
// Config
// ----------
export type Constructor<T> = new (...args: any[]) => T
type LazyMonitorImporter<Type extends EntryType> = () => Promise<{
  default: Constructor<Monitor<Type>>
}>
type MonitorRegister<Type extends EntryType> =
  | Monitor<Type>
  | LazyMonitorImporter<Type>
  | typeof Monitor
type MonitorRegisterWithConfig<Type extends EntryType> = [
  MonitorRegister<Type>,
  Configurations[Type],
]
export type MonitorBaseConfig<Type extends EntryType> = {
  enabled: boolean
  filters: EntryFilterFn<Type>[]
  transformers: EntryTransformerFn<Type>[]
}
export type Handler = string | Function | [LazyImport<Constructor<any>> | Constructor<any>, string?]
export type HandlerInfo = {
  type: 'function' | 'class' | 'name'
  name: string | null
  handler?: string
}

export type DefinableBaseConfig<Type extends EntryType> = Partial<MonitorBaseConfig<Type>>

export type MonitorConfig = {
  enabled: boolean
  route?: {
    name?: string | null
    path?: string | null
    middleware?: OneOrMore<MiddlewareFn | ParsedNamedMiddleware> | []
  }
  monitors: (MonitorRegister<EntryType> | MonitorRegisterWithConfig<EntryType>)[]
}

// ----------
// Types
// ----------
export type LogEvent = {
  logger: Logger
  args: Parameters<LogFn>
  level: LogLevel
}

export enum LogLevel {
  TRACE = 10,
  DEBUG = 20,
  INFO = 30,
  WARN = 40,
  ERROR = 50,
  FATAL = 60,
}

export type ErrorEvent = {
  error: Error
  message: string
}
