import { ApplicationService } from "@adonisjs/core/types"
import Monitor from "./base.js"
import { AuthorizationResponse } from "@adonisjs/bouncer";

type BouncerEntryPayload = {
  user: any;
  action?: string;
  parameters: any[];
  response: AuthorizationResponse;
}

type BouncerType = 'bouncer'
export class BouncerMonitor extends Monitor<BouncerType> {
  get name(): BouncerType { return 'bouncer' }

  get title(): string { return 'Bouncer' }

  get routeName(): string { return 'bouncer' }

  get defaultConfig() { return this.baseConfig() }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    emitter.on('authorization:finished', (event) => this._registerEntry(event))
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    bouncer: BouncerEntryPayload
  }
}