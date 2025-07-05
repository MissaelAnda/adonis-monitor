/// <reference path="../types.ts" />

import { HttpRequestFinishedPayload } from "@adonisjs/core/types/http"
import Monitor from "./base.js"
import { IncomingHttpHeaders } from "http"
import type { EntryFilterFn, EntryTransformerFn, MonitorBaseConfig } from "../types.js"
import { ApplicationService } from "@adonisjs/core/types"
import monitor from "../service/main.js"
import { Response } from '@adonisjs/http-server'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
// type ExtractMethodNames<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T];
// type ExtractMethods<T> = Pick<T, ExtractMethodNames<T>>;
type RequestEntryPayload = {
  duration: [number, number],
  user?: {
    id: any,
    guard?: string,
  },
  route?: {
    name?: string,
    handler: string,
    middleware: string[],
    pattern: string,
    meta: Record<string, any>,
  },
  request: {
    version: string,
    method: HttpMethod,
    id?: string,
    params: Record<string, any>,
    url: string,
    ips: string[],
    host: string | null,
    qs: Record<string, any>,
    headers: IncomingHttpHeaders,
    body: Record<string, any>,
  },
  response: {
    headers: ReturnType<Pick<Response, 'getHeaders'>['getHeaders']>,
    body: any,
  },
}

type RequestMonitorConfiguration = MonitorBaseConfig<RequestType> & {
  responseBodyMaxSize: number,
  truncateResponseBody: boolean,
  truncateHtml: boolean,
  sensitiveDataPatterns: RegExp[],
}

type RequestType = 'request'
export class RequestMonitor extends Monitor<RequestType> {
  get name(): RequestType { return 'request' }

  get filters() {
    return [this.#filterMonitorRequests(), ...super.filters]
  }

  get transformers() {
    return [this.#truncateResponseBody(), this.#removeSensitiveData(), ...super.transformers]
  }

  get defaultConfig() {
    return {
      ...this.baseConfig(),
      truncateResponseBody: true,
      responseBodyMaxSize: 5000,
      truncateHtml: true,
      sensitiveDataPatterns: [/_token/, /cookie/],
    }
  }

  async register(app: ApplicationService) {
    const emitter = await app.container.make('emitter')

    emitter.on('http:request_completed', (payload) => this._registerEntry(this.#format(payload)))
  }

  #format({ ctx, duration }: HttpRequestFinishedPayload) {
    const { auth, request, response, route, params } = ctx
    return {
      duration: duration,
      user: auth?.user ? {
        id: auth.user!.id,
        guard: auth.authenticatedViaGuard,
      } : undefined,
      route: route ? {
        name: route!.name,
        handler: 'UserController@index',
        // handler: formatHandler(route!.handler),
        // middleware: route!.middleware,
        middleware: [],
        pattern: route!.pattern,
        meta: route!.meta,
      } : undefined,
      request: {
        version: request.request.httpVersion,
        method: request.method() as HttpMethod,
        params,
        id: request.id(),
        ips: request.ips(),
        url: request.url(),
        host: request.host(),
        qs: request.qs(),
        headers: request.headers(),
        body: request.body(),
      },
      response: {
        headers: response.getHeaders(),
        body: response.getBody(),
      },
    }
  }

  #filterMonitorRequests(): EntryFilterFn<RequestType> {
    return (entry) => {
      const { route } = entry.payload
      // Don't log monitor requests
      return route?.name === monitor.routeName
      // Only log requests that took over 1 second
      // duration.seconds > 1
    }
  }

  #truncateResponseBody(): EntryTransformerFn<RequestType> {
    return (payload) => {
      if (this.config.truncateHtml) {
        const responseType = payload.response.headers['content-type']
        if (responseType != undefined && responseType!.indexOf('text/html') >= 0) {
          payload.response.body = 'HTML response truncated by Monitor'
        }
      }

      if (this.config.truncateResponseBody && JSON.stringify(payload.response.body).length > this.config.responseBodyMaxSize) {
        payload.response.body = `Response body too large truncated by Monitor because surpassed the max allowed size ${this.config.responseBodyMaxSize}.`
      }

      return payload
    }
  }

  #removeSensitiveData(): EntryTransformerFn<RequestType> {
    return (payload) => {
      const patterns = this.config.sensitiveDataPatterns

      if (patterns.length == 0) {
        return payload
      }

      let sensitiveParts: Record<string, any>[] = [payload.request.body, payload.request.headers, payload.response.headers]

      if (typeof payload.response.body == 'object') {
        sensitiveParts.push(payload.response.body)
      }

      for (const sensitivePayload of sensitiveParts.filter(part => !!part)) {
        Object.keys(sensitivePayload).forEach(key => {
          for (const pattern of patterns) {
            if (pattern.test(key)) {
              sensitivePayload[key] = '********'
            }
          }
        })
      }

      return payload
    }
  }
}

declare module 'adonis-monitor' {
  interface Payloads {
    request: RequestEntryPayload
  }

  interface Configurations {
    request: RequestMonitorConfiguration
  }
}