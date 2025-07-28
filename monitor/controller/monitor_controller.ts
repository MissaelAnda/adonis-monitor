import { errors, type HttpContext } from '@adonisjs/core/http'
import monitor from '../service/main.js'
import is from '@adonisjs/core/helpers/is'

export default class MonitorController {
  async handle({ request, inertia }: HttpContext) {
    const routeResource = request.param('resource')
    // The middleware should warranty this to never be undefined
    const resource = monitor.findMonitorByRouteName(routeResource)!

    const entryId = request.param('entry')
    const view = `resources/${resource.name}/${entryId ? 'entry' : 'index'}`

    const page = request.input('page', 1)

    let pagination = entryId ? undefined : await monitor.getStore().get(resource.name, {
      page: is.integer(Number(page)) ? page : 1,
    })

    let entry = undefined
    if (!!entryId) {
      entry = await monitor.getStore().find(entryId)

      if (!entry) {
        throw new errors.E_ROUTE_NOT_FOUND([request.method(), request.url()])
      }
    }

    return inertia.render(view, {
      resource: resource.name,
      pagination: pagination?.pagination,
      entries: pagination?.entries,
      entry,
    })
  }
}