import { Handler, HandlerInfo } from "./types.js"

export const formatHandler = (handler: Handler): HandlerInfo => {
    if (typeof handler == 'function') {
        return {
            type: 'function',
            name: handler.name,
            handler: anonymousFunctionFormatter(handler),
        }
    }

    if (typeof handler == 'string') {
        return {
            type: 'name',
            name: handler || null,
        }
    }

    const [klass, handle] = handler

    return {
        type: 'class',
        name: klass.name,
        handler: handle || 'handle',
    }
}

const anonymousFunctionFormatter = (func: Function): string => {
    let name = 'Anonymous function'
    if (func.name != '') {
        name += ` ${func.name || `\`${func.toString()}\``}`
    }
    return name
}

type Object = Record<string, any>
export const removeSensitiveData = (patterns: RegExp[], ...records: Object[]): Object => {
    if (patterns.length == 0) {
        return records
    }

    for (const sensitivePayload of records.filter(part => !!part)) {
        Object.keys(sensitivePayload).forEach(key => {
            for (const pattern of patterns) {
                if (pattern.test(key)) {
                    sensitivePayload[key] = '********'
                }
            }
        })
    }

    return records
}