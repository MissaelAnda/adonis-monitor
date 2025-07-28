import { HandlerInfo } from "#monitor/types";

export const formatHandler = (handler: HandlerInfo) => {
    if (handler.type == 'class') {
        let str = handler.name
        if (handler.handler) {
            str += `@${handler.handler}`
        }
        return str
    }

    if (handler.type == 'function') {
        let str = 'AnonymousFunction'
        if (handler.name) {
            str += `@${handler.name}`
        }
        return str
    }

    return handler.name
}