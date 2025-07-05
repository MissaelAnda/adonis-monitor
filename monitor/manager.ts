import { NextFn } from "@adonisjs/core/types/http"
import { errors, HttpContext } from "@adonisjs/core/http"
import { ApplicationService } from "@adonisjs/core/types"
import is from '@adonisjs/core/helpers/is'
import string from '@adonisjs/core/helpers/string'
import { AuthData, Entry, MonitorConfig, Monitors } from "./types.js"
import Monitor from "./monitors/base.js"
import { EntryStore } from "./store/entry_store.js"
import { AuthenticatorClient, AuthManager } from "@adonisjs/auth"
import { Authenticators } from "@adonisjs/auth/types"

export default class MonitorManager {
  declare protected monitors: Monitors
  declare protected authClient: AuthenticatorClient<Authenticators>

  get resources(): string[] {
    return Object.keys(this.monitors)
  }

  set enabled(enabled: boolean) { this.config.enabled = enabled }
  get enabled() { return this.config.enabled }

  getStore() { return this.store }

  constructor(
    protected app: ApplicationService,
    protected store: EntryStore,
    protected config: MonitorConfig,
    protected auth: AuthManager<Authenticators> | undefined,
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
        const guard = this.authClient.use(guardName as keyof Authenticators)

        if (guard.user) {
          return {
            id: guard.user!.id,
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

    router.get(this.routePath, [RequestController])
      .middleware(this.#getMiddlewares())
      .as(this.routeName)
  }

  get routePath() {
    const path = this.config.route?.path ?? 'adonis/monitor'
    return `/${path}/`.replace('\/\/', '/') + ':resource?/:entry?'
  }

  get routeName() {
    return this.config.route?.name ?? 'adonis.monitor'
  }

  #getMiddlewares() {
    let middlewares = this.config.route?.middleware ?? []
    middlewares = is.array(middlewares) ? middlewares : [middlewares]
    return [this.#monitorMiddleware(), ...middlewares];
  }

  #monitorMiddleware() {
    return async ({ request, response }: HttpContext, next: NextFn) => {
      const resource = request.param('resource')
      if (resource == null) {
        return response.redirect().toRoute(this.routeName, { resource: string.plural(this.resources[0]) })
      }

      const resourceName = string.singular(resource).toLowerCase()
      if (!this.resources.find(r => r.toLowerCase() == resourceName)) {
        throw new errors.E_ROUTE_NOT_FOUND([request.method(), request.url()])
      }

      // Normalize url
      if (request.url() != request.url().toLowerCase()) {
        return response.redirect(request.url().toLowerCase())
      }

      await next()
    }
  }

  async #initializeMonitors() {
    this.monitors = {}
    const monitors = await Promise.all(this.config.monitors.map(async monitor => {
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
    }))

    for (const monitor of monitors) {
      this.monitors[monitor.name] = monitor
    }
  }

  async #registerMonitors() {
    await this.#initializeMonitors()

    await Promise.all(Object.values(this.monitors).map(monitor => monitor.register(this.app)))

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