import type { ApplicationService, LoggerService } from '@adonisjs/core/types'
import MonitorManager from '../src/manager.js'
import { LoggerConfig, LoggerManagerConfig } from '@adonisjs/core/types/logger'
import { RuntimeException } from '@adonisjs/core/exceptions'
import { ErrorEvent, LogEvent, LogLevel, MonitorConfig } from '../src/types.js'
import { LogFn, Logger } from 'pino'
import is from '@adonisjs/core/helpers/is'
import { EntryStore } from '../src/store/entry_store.js'
import { LucidEntryStore } from '../src/store/lucid_entry_store.js'

declare module '@adonisjs/core/types' {
  interface EventsList {
    'monitor:log': LogEvent
    'monitor:error': ErrorEvent
  }
}

export default class MonitorProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.bind(EntryStore, async (container) => {
      return await container.make(LucidEntryStore)
    })

    this.app.container.singleton(MonitorManager, async (container) => {
      const config = this.app.config.get<MonitorConfig>('monitor')

      if (!config) {
        throw new RuntimeException(
          'Invalid "config/monitor.ts" file. Make sure you are using the "defineConfig" method'
        )
      }

      const store = await container.make(EntryStore)
      const auth = await container.make('auth.manager')

      return new MonitorManager(this.app, store, config, auth)
    })

    // Overrides the logger creation to add a hook listener to send all log events to it's monitor
    this.app.container.singleton('logger', async () => {
      const { LoggerManager } = await import('@adonisjs/logger')
      const config = this.app.config.get<any>('logger') as LoggerManagerConfig<
        Record<string, LoggerConfig>
      >

      const hooks = await this.loggerListener()
      Object.values(config.loggers).forEach((conf) => {
        conf.hooks = hooks
      })
      return new LoggerManager<any>(config) as LoggerService
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    const monitor = await this.app.container.make(MonitorManager)
    await monitor.boot()
    await this.#registerEdgePlugin()
  }

  async loggerListener() {
    const emitter = await this.app.container.make('emitter')

    const emitException = (args: Parameters<LogFn>) => {
      // Check if log is an exception
      if (
        args.length === 2 &&
        is.object(args[0]) &&
        'err' in args[0] &&
        typeof args[1] === 'string'
      ) {
        const { err }: { err: object } = args[0]
        if (err instanceof Error) {
          const message: string = args[1]

          emitter.emit('monitor:error', { error: err as Error, message })
        }
      }
    }

    return {
      logMethod(this: Logger, args: Parameters<LogFn>, method: LogFn, level: LogLevel) {
        if ([LogLevel.ERROR, LogLevel.FATAL].includes(level)) {
          emitException(args)
        }

        emitter.emit('monitor:log', { logger: this, args, level })

        return method.apply(this, args)
      },
    }
  }

  async #registerEdgePlugin() {
    if (!this.app.usingEdgeJS) return

    const edgeExports = await import('edge.js')
    const { default: plugin } = await import('../src/plugins/edge/main.js')

    edgeExports.default.use(plugin())
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    // Flush startup entries before registering request/command entries
    const monitor = await this.app.container.make(MonitorManager)
    monitor.flush()
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    // Flush entries registered in a command execution
    const monitor = await this.app.container.make(MonitorManager)
    monitor.flush()
  }
}
