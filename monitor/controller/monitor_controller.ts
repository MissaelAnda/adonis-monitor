import type { HttpContext } from '@adonisjs/core/http'
import monitor from '../service/main.js'
import string from '@adonisjs/core/helpers/string'
import { isPromise } from 'util/types'

export default class MonitorController {
  async handle({ request, inertia }: HttpContext) {
    const resource = request.param('resource')
    const resourceName = string.singular(resource)

    const entry = request.param('entry')
    const view = `resources/${resource}/${entry ? 'entry' : 'index'}`

    let pagination = entry ? undefined : monitor.getStore().get(resourceName)

    if (isPromise(pagination)) {
      pagination = await pagination
    }

    return inertia.render(view, {
      entry,
      pagination,
    })
  }
}