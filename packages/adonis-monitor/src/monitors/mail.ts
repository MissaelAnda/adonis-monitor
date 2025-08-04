/// <reference types="@adonisjs/mail/mail_provider" />

import { ApplicationService } from '@adonisjs/core/types'
import Monitor from './base.js'
import { MessageBodyTemplates, NodeMailerMessage } from '@adonisjs/mail/types'
import { MailResponse } from '@adonisjs/mail'

type MailData = {
  metaData?: any
  mailerName: string
}

type MailSentData = MailData & {
  message: NodeMailerMessage
  views: MessageBodyTemplates
  response?: MailResponse<unknown>
}

type MailError = MailData & { error: any }

type MailEntryPayload = MailSentData | MailError

type MailType = 'mail'
export class MailMonitor extends Monitor<MailType> {
  get name(): MailType {
    return 'mail'
  }

  get title(): string {
    return 'Mails'
  }

  get routeName(): string {
    return 'mails'
  }

  get defaultConfig() {
    return this.baseConfig()
  }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    emitter.on('mail:queued', this._registerEntry)
    emitter.on('mail:queueing', this._registerEntry)
    emitter.on('mail:sending', this._registerEntry)
    emitter.on('mail:sent', this._registerEntry)
    emitter.on('queued:mail:error', this._registerEntry)
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    mail: MailEntryPayload
  }
}
