import { Bouncer } from '@adonisjs/bouncer'
import { HttpContextFactory } from '@adonisjs/core/factories/http'

declare module 'adonis-monitor' {
  export interface Payloads extends Record<string, any> {}
  // TODO: When moving to its own package set Configurations value to extend BaseMonitorConfiguration
  export interface Configurations extends Record<string, any> {}
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    bouncer: Bouncer<
      Exclude<HttpContextFactory['auth']['user'], undefined>,
      typeof abilities,
      typeof policies
    >
  }
}
