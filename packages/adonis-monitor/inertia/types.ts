import { UUID } from 'node:crypto'

export type SerializedMonitor = {
  name: string
  title: string
  routeName: string
}

export type Entry = {
  id: UUID
  type: string
  ts: string
  payload: Record<string, any>
}

type MonitorSharedProps = {
  user: any | undefined
  resources: SerializedMonitor[]
  url: string
}

export type MonitorPageProps = {
  resource: string
  pagination?:
    | {
        total: number
        currentPage: number
        hasMorePages: boolean
      }
    | undefined
  entries?: Entry[] | undefined
  entry?: Entry | undefined
  monitor: MonitorSharedProps
}

export type MonitorIndexPageProps = Omit<MonitorPageProps, 'entries' | 'pagination' | 'entry'> & {
  entries: NonNullable<MonitorPageProps['entries']>
  pagination: NonNullable<MonitorPageProps['pagination']>
}

export type MonitorEntryPageProps = Omit<MonitorPageProps, 'entries' | 'pagination' | 'entry'> & {
  entry: NonNullable<MonitorPageProps['entry']>
}

export type Unary<T> = T extends (infer U)[] ? U : T
