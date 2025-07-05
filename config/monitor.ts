import { defineConfig } from '#monitor/define_config'
import { BouncerMonitor } from '#monitor/monitors/bouncer'
import { CacheMonitor } from '#monitor/monitors/cache'
import { ErrorMonitor } from '#monitor/monitors/error'
import { EventMonitor } from '#monitor/monitors/event'
import { LogMonitor } from '#monitor/monitors/log'
import { MailMonitor } from '#monitor/monitors/mail'
import { QueryMonitor } from '#monitor/monitors/query'
import { RequestMonitor } from '#monitor/monitors/request'

const monitor = defineConfig({
  enabled: true,
  route: {
    name: 'monitor',
    path: 'monitor',
    middleware: [],
  },
  monitors: [
    [RequestMonitor, {
      enabled: true,
    }],
    CacheMonitor,
    QueryMonitor,
    LogMonitor,
    ErrorMonitor,
    EventMonitor,
    MailMonitor,
    BouncerMonitor,
  ],
})

export default monitor