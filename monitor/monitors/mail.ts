import { ApplicationService } from "@adonisjs/core/types"
import Monitor from "./base.js"

type MailEntryPayload = {

}

type MailType = 'mail'
export class MailMonitor extends Monitor<MailType> {
  get name(): MailType { return 'mail' }

  get defaultConfig() { return this.baseConfig() }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    emitter.on('mail:queued', (e) => e)
    emitter.on('mail:queueing', (e) => e)
    emitter.on('mail:sending', (e) => e)
    emitter.on('mail:sent', (e) => e)
    emitter.on('queued:mail:error', (e) => e)
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    mail: MailEntryPayload
  }
}