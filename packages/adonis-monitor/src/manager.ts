import { NextFn } from '@adonisjs/core/types/http'
import { errors, HttpContext } from '@adonisjs/core/http'
import { ApplicationService } from '@adonisjs/core/types'
import is from '@adonisjs/core/helpers/is'
import { AuthData, Entry, EntryType, MonitorConfig } from './types.js'
import Monitor from './monitors/base.js'
import { EntryStore } from './store/entry_store.js'
import { AuthenticatorClient, AuthManager } from '@adonisjs/auth'
import { GuardFactory } from '@adonisjs/auth/types'

type Authenticators = Record<string, GuardFactory>

export default class MonitorManager {
  declare protected monitors: Monitor<EntryType>[]
  declare protected authClient: AuthenticatorClient<Authenticators>

  get resources(): Monitor<EntryType>[] {
    return this.monitors
  }

  set enabled(enabled: boolean) {
    this.config.enabled = enabled
  }
  get enabled() {
    return this.config.enabled
  }

  getStore() {
    return this.store
  }

  findMonitorByRouteName(routeName: string): Monitor<EntryType> | undefined {
    return this.monitors.find((resource) => resource.routeName === routeName)
  }

  findMonitorByName(name: string): Monitor<EntryType> | undefined {
    return this.monitors.find((resource) => resource.name === name)
  }

  constructor(
    protected app: ApplicationService,
    protected store: EntryStore,
    protected config: MonitorConfig,
    protected auth: AuthManager<Authenticators> | undefined
  ) {
    if (auth) {
      this.authClient = auth.createAuthenticatorClient()
    }
  }

  async boot() {
    await Promise.all([this.#registerRoute(), this.#registerMonitors()])
  }

  pushEntry(entry: Entry<any>) {
    if (!this.enabled) {
      return
    }

    const auth = this.#resolveAuthData()
    entry.payload = { ...auth, ...entry.payload }

    this.store.push(entry)
  }

  #resolveAuthData(): AuthData | undefined {
    if (this.auth) {
      for (const guardName in Object.entries(this.auth.config.guards).keys()) {
        const guard = this.authClient.use(guardName)

        if (guard.user) {
          return {
            user: guard.user,
            guard: guardName,
          }
        }
      }
    }

    return undefined
  }

  async #registerRoute() {
    const router = await this.app.container.make('router')
    const RequestController = () => import('./controller/monitor_controller.js')

    router
      .group(() => {
        router.get(this.routePath, [RequestController]).as(this.routeName)
        router.put(this.routePath, [RequestController, 'update']).as(`${this.routeName}.update`)
        router.delete(this.routePath, [RequestController, 'destroy']).as(`${this.routeName}.delete`)
      })
      .middleware(this.#getMiddlewares())
  }

  get routePath() {
    const path = this.basePath
    return `/${path}/`.replace('\/\/', '/') + ':resource?/:entry?'
  }

  get basePath() {
    return this.config.route?.path ?? 'adonis/monitor'
  }

  get routeName() {
    return this.config.route?.name ?? 'adonis.monitor'
  }

  #getMiddlewares() {
    let middlewares = this.config.route?.middleware ?? []
    middlewares = is.array(middlewares) ? middlewares : [middlewares]
    return [this.#monitorMiddleware(), ...middlewares]
  }

  #monitorMiddleware() {
    const throwNotFound = (request: HttpContext['request']) => {
      throw new errors.E_ROUTE_NOT_FOUND([request.method(), request.url()])
    }

    return async ({ request, response }: HttpContext, next: NextFn) => {
      const resource = request.param('resource', null)
      if (resource === null) {
        if (this.resources.length === 0) {
          throwNotFound(request)
        }

        return response
          .redirect()
          .toRoute(this.routeName, { resource: this.resources[0].routeName })
      }

      // Normalize url
      if (request.url() !== request.url().toLowerCase()) {
        return response.redirect(request.url().toLowerCase())
      }

      if (!this.resources.find((r) => r.routeName === resource)) {
        throwNotFound(request)
      }

      await next()
    }
  }

  async #initializeMonitors() {
    this.monitors = []
    const monitors = await Promise.all(
      this.config.monitors.map(async (monitor) => {
        let config = {}

        if (is.array(monitor)) {
          // TODO: Load config from configProvider to allow user to define complex IoC configuration
          // https://docs.adonisjs.com/guides/concepts/config-providers
          config = monitor[1]

          monitor = monitor[0]
        }

        if (!(monitor instanceof Monitor)) {
          monitor = await this.app.container.make(monitor)
        }

        monitor.setConfig({
          ...monitor.defaultConfig,
          ...config,
        })
        return monitor
      })
    )

    for (const monitor of monitors) {
      this.monitors.push(monitor)
    }
  }

  async #registerMonitors() {
    await this.#initializeMonitors()

    await Promise.all(Object.values(this.monitors).map((monitor) => monitor.register(this.app)))

    const emitter = await this.app.container.make('emitter')
    // TODO: Fix force the listener for EventMonitor receives this event before the flush
    emitter.on('http:request_completed', () => this.flush())
  }

  flush() {
    if (!this.enabled) {
      return
    }

    this.store.flush()
  }
}
