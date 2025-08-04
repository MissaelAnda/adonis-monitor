/// <reference types="@adonisjs/inertia/inertia_middleware" />

import { errors, type HttpContext } from '@adonisjs/core/http'
import monitor from '../../services/main.js'
import is from '@adonisjs/core/helpers/is'
import { PageObject } from '@adonisjs/inertia/types'
import { EntryPaginationResponse } from '../store/entry_store.js'
import { Entry, EntryType } from '../types.js'
import { DateTime } from 'luxon'
import { UUID } from 'node:crypto'
import { errors as ValidationErrors } from '@vinejs/vine'

type PageProps = {
  resource: EntryType
  pagination: EntryPaginationResponse<keyof EntryType>['pagination'] | undefined
  entries: Entry<EntryType>[] | undefined
  entry: Entry<EntryType> | undefined
}

export default class MonitorController {
  async handle({ request, inertia }: HttpContext): Promise<string | PageObject<PageProps>> {
    const routeResource = request.param('resource')
    // The middleware should warranty this to never be undefined
    const resource = monitor.findMonitorByRouteName(routeResource)!

    const entryId = request.param('entry')
    const view = `${resource.name}/${entryId ? 'entry' : 'index'}`

    const page = request.input('page', 1)

    let pagination = entryId
      ? undefined
      : await monitor.getStore().get(resource.name, {
          page: is.integer(Number(page)) ? page : 1,
        })

    let entry
    if (entryId) {
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

  async update({ response, request }: HttpContext) {
    const id = request.param('entry')
    const store = monitor.getStore()

    const entry = await store.find(id as UUID)

    if (entry?.type !== 'error') {
      throw new ValidationErrors.E_VALIDATION_ERROR('Only error entries are updatable')
    }

    await store.update(id as UUID, { ...entry.payload, resolvedAt: DateTime.now() })

    return response.noContent()
  }

  async destroy({ response, request }: HttpContext) {
    const id = request.param('entry')

    await monitor.getStore().delete(id as UUID)

    return response.noContent()
  }
}
