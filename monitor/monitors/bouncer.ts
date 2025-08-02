import { ApplicationService } from "@adonisjs/core/types"
import Monitor from "./base.js"
import { AuthorizationResponse } from "@adonisjs/bouncer";
import { BaseModel } from "@adonisjs/lucid/orm";
import { removeSensitiveData } from "../helpers.js";

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

  get defaultConfig() {
    return {
      ...this.baseConfig(),
      serializeFullModels: true,
      sensitiveDataPatterns: [/password/],
    }
  }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    emitter.on('authorization:finished', (event) => this._registerEntry(this.#format(event)))
  }

  #format(event: BouncerEntryPayload): BouncerEntryPayload {
    event.parameters = event.parameters.map((parameter) => {
      if (parameter instanceof BaseModel) {
        return {
          type: 'model',
          model: parameter.constructor.name,
          // @ts-ignore: dynamic attribute
          modelOptions: parameter.modelOptions,
          attributes: removeSensitiveData(this.config.sensitiveDataPatterns, parameter.toJSON())[0],
        }
      }

      return parameter
    })

    return event
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    bouncer: BouncerEntryPayload
  }
}