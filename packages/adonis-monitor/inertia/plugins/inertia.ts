import { createInertiaApp } from '@inertiajs/vue3'
import Layout from '../layout/Layout.vue'
import { createApp, DefineComponent, h } from 'vue'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

export type CreateMonitorAppOptions = {
  title?: (title: string) => string
  resolve?: (name: string) => Promise<DefineComponent>
}

export default function createMonitorApp(options: CreateMonitorAppOptions = {}) {
  return createInertiaApp({
    title: options.title ?? ((title: string) => `${title} - Monitor`),

    resolve: async (name: string) => {
      let page = await options.resolve?.(name)
      if (!page) {
        page = await resolvePageComponent(
          `../pages/resources/${name}.vue`,
          import.meta.glob<DefineComponent>('../pages/resources/**/*.vue')
        )
      }

      page!.default.layout = page!.default.layout || Layout

      return page
    },

    setup({ el, App, props, plugin }) {
      createApp({ render: () => h(App, props) })
        .use(plugin)
        .mount(el)
    },
  })
}
