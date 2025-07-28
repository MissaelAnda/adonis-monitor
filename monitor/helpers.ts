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
            name: handler,
        }
    }

    const [klass, handle] = handler

    return {
        type: 'class',
        name: klass.name,
        handler: handle,
    }
}

const anonymousFunctionFormatter = (func: Function): string => {
    let name = 'Anonymous function'
    if (func.name != '') {
        name += ` ${func.name || `\`${func.toString()}\``}`
    }
    return name
}