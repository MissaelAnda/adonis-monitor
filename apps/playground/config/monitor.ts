import { defineConfig } from 'adonis-monitor'
import { BouncerMonitor } from 'adonis-monitor/monitors/bouncer'
import { CacheMonitor } from 'adonis-monitor/monitors/cache'
import { ErrorMonitor } from 'adonis-monitor/monitors/error'
import { EventMonitor } from 'adonis-monitor/monitors/event'
import { LogMonitor } from 'adonis-monitor/monitors/log'
import { MailMonitor } from 'adonis-monitor/monitors/mail'
import { QueryMonitor } from 'adonis-monitor/monitors/query'
import { RequestMonitor } from 'adonis-monitor/monitors/request'

const monitor = defineConfig({
  enabled: true,
  route: {
    name: 'monitor',
    path: 'monitor',
    middleware: [],
  },
  monitors: [
    [
      RequestMonitor,
      {
        enabled: true,
      },
    ],
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
