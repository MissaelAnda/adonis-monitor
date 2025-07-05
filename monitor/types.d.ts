declare module 'adonis-monitor' {
    export interface Payloads extends Record<string, any> { }
    // TODO: When moving to its own package set Configurations value to extend BaseMonitorConfiguration
    export interface Configurations extends Record<string, any> { }
}