import monitor from '#monitor/service/main'
import router from '@adonisjs/core/services/router'
import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: ({ route }) => {
    if (route?.name == monitor.routeName) {
      return 'monitor_layout'
    }
    return 'inertia_layout'
  },

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    monitor: (ctx) => ({
      user: ctx.inertia.always(() => ctx.auth.user),
      resources: monitor.resources.map(resource => resource.toJSON()),
      url: router.makeUrl(monitor.routeName, {
        resource: '{resource}',
      }).replace('{resource}', '')
    })
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.ts'
  }
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> { }
}