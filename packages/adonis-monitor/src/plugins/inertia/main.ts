/// <reference types="@adonisjs/auth/initialize_auth_middleware" />

import { configProvider } from '@adonisjs/core'
import { ConfigProvider } from '@adonisjs/core/types'
import { ResolvedConfig } from '@adonisjs/inertia/types'
import monitor from '../../../services/main.js'
import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'

export default function withMonitor(
  provider: ConfigProvider<ResolvedConfig<{}>>
): ConfigProvider<ResolvedConfig<{}>> {
  return configProvider.create(async (app) => {
    const config = await provider.resolver(app)

    config.sharedData.monitor = (ctx: HttpContext) => ({
      user: ctx.auth?.user,
      resources: monitor.resources.map((resource) => resource.toJSON()),
      url: router.makeUrl(monitor.routeName, { resource: '{resource}' }).replace('{resource}', ''),
    })
    config.rootView = extendRootView(config.rootView)
    config.ssr.pages = extendSSR(config.ssr.pages)

    return config
  })
}

function extendRootView(option: ResolvedConfig<{}>['rootView']): ResolvedConfig<{}>['rootView'] {
  return (ctx) => {
    if (ctx.route?.name === monitor.routeName) return 'monitor::monitor_layout'
    if (typeof option === 'string') return option
    return option(ctx)
  }
}

function extendSSR(option: ResolvedConfig<{}>['ssr']['pages']): ResolvedConfig<{}>['ssr']['pages'] {
  return (ctx, page) => {
    if (ctx.route?.name === monitor.routeName) return false
    if (option === undefined) return true
    if (Array.isArray(option)) return option.includes(page)
    return option(ctx, page)
  }
}
