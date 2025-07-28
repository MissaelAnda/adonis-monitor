/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css';
import Layout from '../layout/Layout.vue'
import { createApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const page = await resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue'),
    )

    // TODO: when moving this to a package set the resources to the namespace `monitor::`
    // then use that namespace to know when to inject the layout
    if (name.startsWith('resources/')) {
      page.default.layout = page.default.layout || Layout
    }

    return page
  },

  setup({ el, App, props, plugin }) {

    createApp({ render: () => h(App, props) })

      .use(plugin)
      .mount(el)
  },
})