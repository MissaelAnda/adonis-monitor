import { Payloads } from "adonis-monitor";
import MonitorController from "../monitor/controller/monitor_controller"
import { InferPageProps, SharedProps } from '@adonisjs/inertia/types'
import { UUID } from "crypto";

// export type BasePageProps = InferPageProps<MonitorController, 'handle'>
export type BasePageProps = {
    resource: keyof Payloads;
    pagination?: {
        total: number;
        currentPage: number;
        hasMorePages: boolean;
    } | undefined;
    entries?: Entry[] | undefined;
    entry?: Entry | undefined;
    monitor: SharedProps['monitor'],
}
// export type Entry = Unary<BasePageProps['entries']> & {
//     payload: Record<string, any>,
// }
export type Entry = {
    id: UUID,
    type: string,
    ts: string,
    payload: Record<string, any>,
};
export type MonitorPageProps = Omit<BasePageProps, 'entries'> & {
    entries?: Entry[] | undefined,
}

export type MonitorIndexPageProps = Omit<BasePageProps, 'entries' | 'pagination' | 'entry'> & {
    entries: NonNullable<BasePageProps['entries']>,
    pagination: NonNullable<BasePageProps['pagination']>,
}

export type MonitorEntryPageProps = Omit<BasePageProps, 'entries' | 'pagination' | 'entry'> & {
    entry: NonNullable<BasePageProps['entry']>,
}

export type Unary<T> = T extends (infer U)[] ? U : T;